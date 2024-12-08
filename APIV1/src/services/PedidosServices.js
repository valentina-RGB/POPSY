const express = require('express');
const {request , response} = require('express');
const db = require('../data/db');
const { Op } = require('sequelize');
const {Pedidos, Producto_Pedidos,Producto_insumos, Adiciones,Insumos, Adiciones_Insumos , Productos,StockInsumos } = require('../../models');


    const
     getPedidos = async (res,req) => {
      try {
        const pedidos = await Pedidos.findAll({
          include: [
            {
                model: Productos,
                as: 'ProductosLista', // Alias definido en la relación Pedidos -> Productos
                attributes: ['ID_producto', 'nombre', 'precio_neto', 'stock_bola'],
                through: {
                attributes: ['cantidad', 'sub_total'], // Campos de la tabla intermedia
                }
            }
        ],
        });

        res.status(200).json(pedidos);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener pedidos', error });
        }
    },

    
    getPedidosID = async (id) => {
        const pedidos = await Pedidos.findByPk(id,{
        include: [
            {
                model: Productos,
                as: 'ProductosLista', // Alias definido en la relación Pedidos -> Productos
                attributes: ['ID_producto', 'nombre', 'precio_neto', 'stock_bola'],
                through: {
                attributes: ['cantidad', 'sub_total'], // Campos de la tabla intermedia
                },
                include:
                [
                {
                    model: Producto_Pedidos, // Relación Productos -> Producto_Pedidos
                    as: 'Producto_Pedido', // Alias definido en Productos
                    where: {
                      ID_pedido: id, // Asegúrate de filtrar por el pedido actual
                    },
                    include:
                    [
                        {
                            model: Adiciones, // Relación Producto_Pedidos -> Adiciones
                            as: 'Adiciones', // Alias definido en Producto_Pedidos
                            attributes: ['cantidad', 'total', 'ID_adicion'],
                            include:[
                            {
                              model: Insumos,  // Relación entre Adiciones e Insumos
                              as: 'Insumos',
                              through: {
                                model:Adiciones_Insumos,
                                attributes: ['cantidad','sub_total'],
                              },
                              attributes: ['ID_insumo','descripcion_insumo', 'precio'],
                            }
                        ]
                        }
                    ]        
                    }
                ]
            }
        ],
        });
        return pedidos; 
    } ,

    CrearPedidos = async (req = request, res = response) => {
    const { ID_clientes, ProductosLista } = req.body;
 
      try {
          if (!ID_clientes || !ProductosLista || !Array.isArray(ProductosLista) || ProductosLista.length === 0) {
              return res.status(400).json({ message: 'Faltan datos para crear el pedido' });
          }
 
          let total_pedido = 0;
          const combinacionesUnicas = new Set(); // Evitar combinaciones duplicadas de insumos
 
          // Crear el pedido
          const Nuevopedido = await Pedidos.create({
              fecha: Date.now(),
              ID_clientes,
              precio_total: total_pedido,
              ID_estado_pedido: 1, // Asumimos que "1" significa "pendiente" o similar
          });
 
          for (const productos of ProductosLista) {
              const producto = await Productos.findByPk(productos.ID_producto);
 
              if (!producto) {
                  return res.status(404).json({ message: `Producto con ID ${productos.ID_producto} no encontrado` });
              }

              const resultInsumos = await Producto_insumos.findAll({where:{ID_productos_tipo:productos.ID_producto}})

              for (const stockProducto of resultInsumos){
                 // Stock de los insumos

                 const stockResult = await StockInsumos.findAll({where:{ID_insumo:stockProducto.ID_insumos_tipo}})

                 // Obtenemos el primer registro
                 const stock = stockResult[0];

                 if(stock && stock.stock_actual !=0){
                    const resultado = stockProducto.cantidad  *  productos.cantidad
                     if(resultado <= stock.stock_actual){
                         const cantidad = stock.stock_actual - resultado;
                         console.log(cantidad)
                         await stock.update({stock_actual:cantidad})
                     }else{
                         return res.status(400).json({ message: `El stock de insumo es de  ${stock.stock_actual}` });
                     }
                 }
                
              }
 
              let sub_total_insumos = 0;
 
             
              // Procesar las Adiciones (si las hay)
              if (Array.isArray(productos.Producto_Pedido)) {


                const productoPedido = await Producto_Pedidos.create({
                  ID_pedido: Nuevopedido.ID_pedido,
                  ID_producto: producto.ID_producto,
                  cantidad:producto.cantidad || 1,
                  precio_neto: producto.precio_neto,
                  sub_total: 0, // Se actualizará luego
              });
                for( const producto_pedidos of  productos.Producto_Pedido){

                     let cantidad_insumos = 0;
                    // ADICIONES
                    for (const adiciones of producto_pedidos.Adiciones) {
                      let adiciones_total = 0;
 
                      // Crear clave única para la combinación de insumos
                    //   const insumoIDsOrdenados = adiciones.Insumos.map((i) => i.ID_insumo).sort().join('-');
                    //   if (combinacionesUnicas.has(insumoIDsOrdenados)) continue; // Saltar si ya se procesó
                    //         combinacionesUnicas.add(insumoIDsOrdenados);

                    //         // Crear la adición
                    //         const nuevaAdicion = await Adiciones.create({
                    //         cantidad: adiciones.cantidad || 1,
                    //         total: 0, // Se actualizará luego
                    //         ID_producto_pedido: productoPedido.ID_producto_pedido, // Relación con ProductoPedido
                    //     });
                        
                            // Crear la adición
                            const nuevaAdicion = await Adiciones.create({
                                cantidad: adiciones.cantidad || 1,
                                total: 0, // Se actualizará luego
                                ID_producto_pedido: productoPedido.ID_producto_pedido, // Relación con ProductoPedido
                            })

                      // PROCESAR INSUMOS DE LA ADICION 

                        if (Array.isArray(adiciones.Insumos)) {

                        for (const insumoData of adiciones.Insumos) {
                            const insumo = await Insumos.findByPk(insumoData.ID_insumo);
                            
                            if (!insumo) {
                                return res.status(404).json({ message: `Insumo con ID ${insumoData.ID_insumo} no encontrado` });
                            }

                              // Calcular el subtotal del insumo
                              const subTotalInsumo = (insumoData.Adiciones_Insumos.cantidad || 1) * insumo.precio;

                              // Crear relación Adiciones_Insumos
                            await Adiciones_Insumos.create({
                                ID_adicion_p: nuevaAdicion.ID_adicion,
                                ID_insumo_p: insumoData.ID_insumo,
                                cantidad: insumoData.Adiciones_Insumos.cantidad,
                                sub_total: subTotalInsumo
                            });

                            cantidad_insumos += (insumoData.Adiciones_Insumos.cantidad)

                            adiciones_total += subTotalInsumo; // Acumular subtotal de la adición

                            // Stock de los insumos

                            const stock = await StockInsumos.findOne({where:{ID_insumo:insumoData.ID_insumo}})

                            if(stock && stock.stock_actual !=0){
                                if(insumoData.Adiciones_Insumos.cantidad <= stock.stock_actual){
                                    const cantidad = stock.stock_actual - insumoData.Adiciones_Insumos.cantidad;
                                    console.log(cantidad)
                                    await stock.update({stock_actual:cantidad})
                                }else{
                                    return res.status(400).json({ message: `El stock de insumo es de  ${stock.stock_actual}` });
                                }
                            }


                            const stock_producto = await Productos.findOne({where:{ID_producto: productos.ID_producto}})
                            console.log( 'STOCK',stock_producto.stock_bola)


                            //TIPO DE INSUMO 
                           
                            console.log('stock', insumo.ID_tipo_insumo)
                        }
                    }


                    cantidad_insumos *=(adiciones.cantidad || 1)
                      // Actualizar el total de la adición
                     adiciones_total *= (adiciones.cantidad || 1);
                    await nuevaAdicion.update({ total: adiciones_total });
 
                      sub_total_insumos += adiciones_total; // Sumar subtotal de la adición al producto

                      console.log("CANTIDAD DE INSUMOS:", cantidad_insumos)
                }
                    // Calcular y actualizar el subtotal de ProductoPedido
                const sub_total_producto = (producto.precio_neto * productos.cantidad) + sub_total_insumos;
                total_pedido += sub_total_producto;
                console.log('SUBTOTAL', sub_total_producto, 'SUBTOTAL DE INSUMOS',sub_total_insumos)
                 



                  await productoPedido.update({ sub_total: sub_total_producto});
                }
              }
 
           
 
             
          }
 
          // Actualizar el total del pedido
          await Nuevopedido.update({ precio_total: total_pedido });
 
          return res.status(201).json({ status: 201, message: 'Se ha creado el pedido', ProductosLista });
      } catch (err) {
          console.error(err);
          if (!res.headersSent) {
              return res.status(500).json({ message: 'Error al crear el pedido', error: err.message });
          }
      }
  },
 
   
  PatchPedidos = async (req = request, res = response) => {
    const { id } = req.params;
    const { ID_clientes, ProductosLista, ID_estado_pedido } = req.body;
  
  
    try {
        const pedido = await Pedidos.findByPk(id);
        if (!pedido) return res.status(404).json({ message: `Pedido con ID ${id} no encontrado` });
  
  
        if (ID_clientes) await pedido.update({ ID_clientes });

           // Actualizamos el estado si se proporciona
        if (ID_estado_pedido) {
            await pedido.update({ ID_estado_pedido });
            // return res.status(200).json({ message: `Es estado a sido cambiado` });
        }
  
         
        const productosRelacionados = await Producto_Pedidos.findAll({
            where: { ID_pedido: id },
            include: [
                {
                    model: Adiciones,
                    as: 'Adiciones',
                    include: [
                        {
                            model: Insumos,
                            as: 'Insumos',
                            through: { model: Adiciones_Insumos }
                        }
                    ]
                }
            ]
        });
  
  
        // Agregar logging para ver los datos cargados
        console.log('Productos relacionados:', JSON.stringify(productosRelacionados, null, 2));
  
  
        if (ProductosLista && Array.isArray(ProductosLista)) {

            let total_pedido = 0;
            const idsProductosNuevos = ProductosLista.map((p) => p.ID_producto);
  
            // Eliminar productos que no están en la lista
            for (const productoActual of productosRelacionados) {
                if (!idsProductosNuevos.includes(productoActual.ID_producto)) {
                    if (productoActual.Adiciones && Array.isArray(productoActual.Adiciones)) {
                        for (const adicion of productoActual.Adiciones) {

                            for(const insumos of adicion.Insumos){

                                const Insumostock = await StockInsumos.findOne({where:{ID_insumo:insumos.ID_insumo}})

                                console.log("ENTREEEEEEE")
                                if(Insumostock && Insumostock !=0){
                                    const cantidad = Insumostock.stock_actual + (insumos.Adiciones_Insumos.cantidad * adicion.cantidad)
                                    await Insumostock.update({stock_actual:cantidad })
                                }                           
                            }
                            await Adiciones_Insumos.destroy({ where: { ID_adicion_p: adicion.ID_adicion } });
                            await Adiciones.destroy({ where: { ID_adicion: adicion.ID_adicion } });
                        }
                    }

                    const producto = await Productos.findByPk(productoActual.ID_producto);
 
                
                    const resultInsumos = await Producto_insumos.findAll({where:{ID_productos_tipo:producto.ID_producto}})
      
                    for (const stockProducto of resultInsumos){
                       // Stock de los insumos
      
                       const stock = await StockInsumos.findOne({where:{ID_insumo:stockProducto.ID_insumos_tipo}})
      
      
                       if(stock && stock.stock_actual !=0){
                          const resultado = stockProducto.cantidad  * productoActual.cantidad
                           if(resultado <= stock.stock_actual){
                               const cantidad = stock.stock_actual + resultado;
                               console.log(cantidad)
                               await stock.update({stock_actual:cantidad})
                           }else{
                               return res.status(400).json({ message: `El stock de insumo es de  ${stock.stock_actual}` });
                           }
                       }
                      
                    }

                    await Producto_Pedidos.destroy({ where: { ID_producto_pedido: productoActual.ID_producto_pedido } });
                }
            }
  
  
            for (const productos of ProductosLista) {
                const producto = await Productos.findByPk(productos.ID_producto);
                if (!producto) return res.status(404).json({ message: `Producto con ID ${productos.ID_producto} no encontrado` });
  
  
                let productoPedido = await Producto_Pedidos.findOne({
                    where: { ID_pedido: pedido.ID_pedido, ID_producto: producto.ID_producto },
                    include: [{ model: Adiciones, as: 'Adiciones', 
                        include: [
                        {
                            model: Insumos,
                            as: 'Insumos',
                            through: { model: Adiciones_Insumos }
                        }
                    ]}] // Incluimos Adiciones aquí
                });
  
  
                // Comprobamos si productoPedido tiene Adiciones correctamente cargado
                if (!productoPedido) {
                    productoPedido = await Producto_Pedidos.create({
                        ID_pedido: pedido.ID_pedido, ID_producto: producto.ID_producto, cantidad: productos.cantidad || 1, precio_neto: producto.precio_neto, sub_total: 0
                    });
                } else {
                    await productoPedido.update({ cantidad: productos.cantidad || productoPedido.cantidad });
                }
  
  
                let sub_total_insumos = 0;
  
  
                if (Array.isArray(productos.Producto_Pedido)) {

                    const idsAdicionesNuevas = productos.Producto_Pedido.flatMap((p) => p.Adiciones.map((a) => a.ID_adicion));
  
  
                    // Confirmamos que productoPedido.Adiciones existe antes de iterar
                    if (productoPedido.Adiciones && Array.isArray(productoPedido.Adiciones)) {  // Verificación de existencia y tipo
                        for (const adicion of productoPedido.Adiciones) {
                            if (!idsAdicionesNuevas.includes(adicion.ID_adicion)) {

                                for(const insumos of adicion.Insumos){

                                    const Insumostock = await StockInsumos.findOne({where:{ID_insumo:insumos.ID_insumo}})
                                    if(Insumostock && Insumostock !=0){
                                        const cantidad = Insumostock.stock_actual + (insumos.Adiciones_Insumos.cantidad * adicion.cantidad||1)
                                        await Insumostock.update({stock_actual:cantidad })
                                    }  

                                }
                                await Adiciones_Insumos.destroy({ where: { ID_adicion_p: adicion.ID_adicion } });
                                await Adiciones.destroy({ where: { ID_adicion: adicion.ID_adicion } });
                            }
                        }
                    } else {
                        console.warn("Adiciones no está disponible o no es un array en productoPedido.");
                    }
  
  
                    for (const producto_pedidos of productos.Producto_Pedido) {
                        for (const adiciones of producto_pedidos.Adiciones) {
                            let adicion = await Adiciones.findOne({
                                where: { ID_producto_pedido: productoPedido.ID_producto_pedido, id_adicion: adiciones.ID_adicion || null }
                            });
  
  
                            if (!adicion) {
                                adicion = await Adiciones.create({
                                    cantidad: adiciones.cantidad || 1, total: 0, ID_producto_pedido: productoPedido.ID_producto_pedido
                                });
                            } else {
                                await adicion.update({ cantidad: adiciones.cantidad || adicion.cantidad });
                            }
  
  
                            let adiciones_total = 0;
  
  
                            if (Array.isArray(adiciones.Insumos)) {

                                const idsInsumosNuevos = adiciones.Insumos.map((i) => i.ID_insumo);

                       
                                await Adiciones_Insumos.destroy({
                                    where: { ID_adicion_p: adicion.ID_adicion, ID_insumo_p: { [Op.notIn]: idsInsumosNuevos } }
                                });
  
  
                                for (const insumoData of adiciones.Insumos) {
                                    const insumo = await Insumos.findByPk(insumoData.ID_insumo);
                                    if (!insumo) return res.status(404).json({ message: `Insumo con ID ${insumoData.ID_insumo} no encontrado` });

                                    const insumoStock = await StockInsumos.findOne({where: {ID_insumo: insumo.ID_insumo}})

                                    if(insumoStock && insumoStock.stock_actual !=0){
                                    const cantidad = insumoStock.stock_actual - (insumoData.Adiciones_Insumos.cantidad * adiciones.cantidad||1)
                                    insumoStock.update({stock_actual: cantidad})
                                    }
  
                                    const subTotalInsumo = (insumoData.Adiciones_Insumos.cantidad || 1) * insumo.precio;
                                    await Adiciones_Insumos.upsert({
                                        ID_adicion_p: adicion.ID_adicion, ID_insumo_p: insumo.ID_insumo, cantidad: insumoData.Adiciones_Insumos.cantidad, sub_total: subTotalInsumo
                                    });

                                    adiciones_total += subTotalInsumo;
                                }
                            }
                            adiciones_total *= adiciones.cantidad || 1;
                            await adicion.update({ total: adiciones_total });
                            sub_total_insumos += adiciones_total;
                        }
                    }
                }
                const sub_total_producto = (producto.precio_neto * productoPedido.cantidad) + sub_total_insumos;
                total_pedido += sub_total_producto;
                await productoPedido.update({ sub_total: sub_total_producto });
            }
        
            await pedido.update({ precio_total: total_pedido});
        }
  
  
       
        return res.status(200).json({ message: 'Pedido actualizado correctamente', pedido });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message });
    }
},







DeletePedidos = async (id, res, req) => {

    const pedidos = await Pedidos.findOne({where:{ID_pedido: id}});

    if(!pedidos){
        res.status(404).json({ message: 'Orden no encontrada' })
    }

        const productosRelacionados = await Producto_Pedidos.findAll({
            where: { ID_pedido: id },
            include: [
                {
                    model: Adiciones,
                    as: 'Adiciones',
                    include: [
                        {
                            model: Insumos,
                            as: 'Insumos',
                            through: { model: Adiciones_Insumos }
                        }
                    ]
                }
            ]
        });

        if (productosRelacionados && Array.isArray(productosRelacionados)) {
            // Eliminar productos que no están en la lista
            for (const productoActual of productosRelacionados) {
            
                    if (productoActual.Adiciones && Array.isArray(productoActual.Adiciones)) {
                        for (const adicion of productoActual.Adiciones) {

                            for(const insumos of adicion.Insumos){

                                const Insumostock = await StockInsumos.findOne({where:{ID_insumo:insumos.ID_insumo}})

                                if(Insumostock && Insumostock !=0){
                                    const cantidad = Insumostock.stock_actual + insumos.Adiciones_Insumos.cantidad
                                    await Insumostock.update({stock_actual:cantidad })
                                }                           
                            }
                            await Adiciones_Insumos.destroy({ where: { ID_adicion_p: adicion.ID_adicion } });
                            await Adiciones.destroy({ where: { ID_adicion: adicion.ID_adicion } });
                        }
                    }

                    const producto = await Productos.findByPk(productoActual.ID_producto);
 
                
                    const resultInsumos = await Producto_insumos.findAll({where:{ID_productos_tipo:producto.ID_producto}})
      
                    for (const stockProducto of resultInsumos){
                       // Stock de los insumos
      
                       const stock = await StockInsumos.findOne({where:{ID_insumo:stockProducto.ID_insumos_tipo}})
      
      
                       if(stock && stock.stock_actual !=0){
                          const resultado = stockProducto.cantidad  * productoActual.cantidad
                           if(resultado <= stock.stock_actual){
                               const cantidad = stock.stock_actual + resultado;
                               console.log(cantidad)
                               await stock.update({stock_actual:cantidad})
                           }else{
                               return res.status(400).json({ message: `El stock de insumo es de  ${stock.stock_actual}` });
                           }
                       }
                      
                    }

                    await Producto_Pedidos.destroy({ where: { ID_producto_pedido: productoActual.ID_producto_pedido } });
                
            }
        }

    res.status(200).json({ message: 'Pedido cancelado correctamente', pedidos });
  
},

pedidosDelete = async (id) =>{

    const deleted = await Pedidos.destroy({ where: {ID_pedido: id}, });

    if (deleted) {
        return {status: 200 , message: 'Operacion realizada'}
    }else{
        return {status: 404, message: 'Order not found' };
    }

}


module.exports = {
    getPedidos,
    getPedidosID,
    PatchPedidos,
    DeletePedidos,
    CrearPedidos,
    pedidosDelete
}
