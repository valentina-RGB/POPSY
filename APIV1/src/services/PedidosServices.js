const express = require('express');
const {request , response} = require('express');
const db = require('../data/db');
const { Op } = require('sequelize');
const {Productos_adiciones, Pedidos, Producto_Pedidos,Producto_insumos, Adiciones,Insumos, Adiciones_Insumos , Productos} = require('../../models');



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
              },
              // include: 
              //   [
              //     {
              //       model: Producto_Pedidos, // Relación Productos -> Producto_Pedidos
              //       as: 'Producto_Pedido', // Alias definido en Productos
                    
              //       include: 
              //         [
              //           {
              //             model: Adiciones, // Relación Producto_Pedidos -> Adiciones
              //             as: 'Adiciones', // Alias definido en Producto_Pedidos
              //             attributes: ['cantidad', 'total'],
              //             include:[
              //               {
              //                 model: Insumos,  // Relación entre Adiciones e Insumos
              //                 as: 'Insumos', 
              //                 through: {
              //                   model:Adiciones_Insumos, 
              //                   attributes: ['cantidad','sub_total'],
              //                 },
              //                 attributes: ['ID_insumo','descripcion_insumo', 'precio'],
              //               }
              //             ] 
              //         }
              //         ]
              //     }
              //   ]
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
                          attributes: ['cantidad', 'total'],
                          
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

    // CrearPedidos = async (req = request, res = response) => {
    //   const { ID_clientes, ProductosLista } = req.body;
    
    //   try {
    //       let total_pedido = 0;
    
    //       if (!ID_clientes || !ProductosLista || !Array.isArray(ProductosLista) || ProductosLista.length === 0) {
    //           return res.status(400).json({ message: 'Faltan datos para crear el pedido' });
    //       }
    
    //       // Crear el pedido
    //       const Nuevopedido = await Pedidos.create({
    //           fecha: Date.now(),
    //           ID_clientes: ID_clientes||1,
    //           precio_total: total_pedido,
    //           ID_estado_pedido: 1,
    //       });
    
    //       for (const productos of ProductosLista) {
    //           const producto = await Productos.findByPk(productos.ID_producto);
    //           if (!producto) {
    //               return res.status(404).json({ message: `Producto con ID ${productos.ID_producto} no encontrado` });
    //           }
    
    //           const cantidadProducto = productos.Adiciones.length > 0 ? productos.Adiciones.length : 1;
    //           const subTotal = producto.precio_neto * cantidadProducto;
    //           total_pedido += subTotal;
    
    //           let sub_total_insumos = 0;
    
    //           // Validar y agregar adiciones
    //           if (Array.isArray(productos.Adiciones)) {
    //               for (const adiciones of productos.Adiciones) {
    //                   let adiciones_total = 0;
    
    //                   // Crear adición y relaciones
    //                   const Nueva_adicion = await Adiciones.create({
    //                       cantidad: adiciones.cantidad || 1,
    //                       total: 0,
    //                   });
                      
    //                   await Productos_adiciones.create({
    //                       ID_Producto_adicion: productos.ID_producto,
    //                       ID_adiciones: Nueva_adicion.ID_adicion,
    //                       sub_total: Nueva_adicion.total,
    //                   });
    
    //                   // Procesar los insumos dentro de la adición
    //                   if (Array.isArray(adiciones.Insumos)) {
    //                       for (const I of adiciones.Insumos) {


    //                         // console.table('Insumos', I)
    //                           const Insumo = await Insumos.findByPk(I.ID_insumo);
    
    //                           if (!Insumo) {
    //                               return res.status(404).json({ message: `Insumo con ID ${I.ID_insumo} no encontrado` });
    //                           }
    
    //                           const subTotalInsumo = I.Adiciones_Insumos.cantidad * Insumo.precio;
    //                           await Adiciones_Insumos.create({
    //                               ID_adicion_p: Nueva_adicion.ID_adicion,
    //                               ID_insumo_p: I.ID_insumo,
    //                               cantidad: I.Adiciones_Insumos.cantidad,
    //                               sub_total: subTotalInsumo,
    //                           });
    
    //                           // Acumular subtotal de insumo en el total de la adición
    //                           adiciones_total += subTotalInsumo;
    //                       }
    //                   }
    
    //                   // Multiplicar adiciones_total por cantidad de la adición y actualizar
    //                   adiciones_total *= adiciones.cantidad || 1;
    //                   await Adiciones.update({ total: adiciones_total }, { where: { ID_adicion: Nueva_adicion.ID_adicion } });
    //                   await Productos_adiciones.update({ sub_total: adiciones_total }, { where: { ID_adiciones: Nueva_adicion.ID_adicion } });
    
    //                   // Sumar al total de insumos del producto
    //                   sub_total_insumos += adiciones_total;
    //               }
    //           }
    
    //           // Crear Producto_Pedido con subtotales
    //           await Producto_Pedidos.create({
    //               ID_pedidos: Nuevopedido.ID_pedido,
    //               ID_productos: producto.ID_producto,
    //               cantidad: cantidadProducto,
    //               precio_neto: producto.precio_neto,
    //               sub_total: subTotal + sub_total_insumos,
    //           });
    
    //           total_pedido += sub_total_insumos;
    //       }
    
    //       // Actualizar el precio total del pedido
    //       await Nuevopedido.update({ precio_total: total_pedido });
    
    //       return res.status(201).json({ status: 201, message: 'Se ha creado el pedido' });
    //   } catch (err) {
    //       console.error(err);
    //       if (!res.headersSent) {
    //           return res.status(500).json({ message: 'Error al crear el pedido', error: err.message });
    //       }
    //   }
    // },
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

                     // Crear ProductoPedido
           

                    for (const adiciones of producto_pedidos.Adiciones) {
                      let adiciones_total = 0;
  
                      // Crear clave única para la combinación de insumos
                      const insumoIDsOrdenados = adiciones.Insumos.map((i) => i.ID_insumo).sort().join('-');
                      if (combinacionesUnicas.has(insumoIDsOrdenados)) continue; // Saltar si ya se procesó
                      combinacionesUnicas.add(insumoIDsOrdenados);
  
                      // Crear la adición
                      const nuevaAdicion = await Adiciones.create({
                          cantidad: adiciones.cantidad || 1,
                          total: 0, // Se actualizará luego
                          ID_producto_pedido: productoPedido.ID_producto_pedido, // Relación con ProductoPedido
                      });
  
                      // Procesar insumos de la adición
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
                                  sub_total: subTotalInsumo,
                              });
  
                              adiciones_total += subTotalInsumo; // Acumular subtotal de la adición
                          }
                      }
  
                      // Actualizar el total de la adición
                      adiciones_total *= (adiciones.cantidad || 1);
                      await nuevaAdicion.update({ total: adiciones_total });
  
                      sub_total_insumos += adiciones_total; // Sumar subtotal de la adición al producto
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
  const { ID_clientes, ProductosLista } = req.body;

  try {
      const pedido = await Pedidos.findByPk(id);
      if (!pedido) return res.status(404).json({ message: `Pedido con ID ${id} no encontrado` });

      if (ID_clientes) await pedido.update({ ID_clientes });

      let total_pedido = 0;
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
          const idsProductosNuevos = ProductosLista.map((p) => p.ID_producto);

          // Eliminar productos que no están en la lista
          for (const productoActual of productosRelacionados) {
              if (!idsProductosNuevos.includes(productoActual.ID_producto)) {
                  if (productoActual.Adiciones && Array.isArray(productoActual.Adiciones)) {
                      for (const adicion of productoActual.Adiciones) {
                          await Adiciones_Insumos.destroy({ where: { ID_adicion_p: adicion.ID_adicion } });
                          await Adiciones.destroy({ where: { ID_adicion: adicion.ID_adicion } });
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
                  include: [{ model: Adiciones, as: 'Adiciones' }] // Incluimos Adiciones aquí
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
      }

      await pedido.update({ precio_total: total_pedido });
      return res.status(200).json({ message: 'Pedido actualizado correctamente', pedido });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message });
  }
},




    DeletePedidos = async (id) => {
        const deleted = await Pedidos.destroy({ where: {ID_pedido: id}, });
        if (deleted) {
        return deleted;
    }else{
        return {status: 404, message: 'Order not found' };
    }
} 


        
        

module.exports = {
    getPedidos,
    getPedidosID,
    PatchPedidos,
    DeletePedidos,
    CrearPedidos
}