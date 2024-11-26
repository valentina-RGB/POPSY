const express = require('express');
const {request , response} = require('express');
const db = require('../data/db');
const { Op, where } = require('sequelize');
const {sequelize, Ventas, Producto_Ventas,Producto_insumos, Adiciones,Insumos, Adiciones_Insumos , Productos,StockInsumos } = require('../../models');

    const
     getVentas = async (res,req) => {
      try {
        const ventas = await Ventas.findAll({
          include: [
            {
              model: Productos,
              as: 'ProductosLista', // Alias definido en la relación Ventas -> Productos
              attributes: ['ID_producto', 'nombre', 'precio_neto', 'stock_bola'],
              through: {
                attributes: ['cantidad', 'sub_total'], // Campos de la tabla intermedia
              },
            }
          ],
        });
   
        res.status(200).json(ventas);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener ventas', error });
      }
    },
   
       
    getVentasID = async (id) => {
        const ventas = await Ventas.findByPk(id,{
          include: [
            {
              model: Productos,
              as: 'ProductosLista', 
              attributes: ['ID_producto', 'nombre', 'precio_neto', 'stock_bola'],
              through: {
                attributes: ['cantidad', 'sub_total'], 
              },
              include:
                [
                  {
                    model: Producto_Ventas, // Relación Productos -> Producto_Ventas
                    as: 'Producto_Venta', // Alias definido en Productos
                    where: {
                      ID_venta: id, 
                    },
                    include:
                      [
                        {
                          model: Adiciones, 
                          as: 'Adiciones', 
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
        return ventas;
       
    } ,

    CrearVentas = async (req = request, res = response) => {
      const { ID_clientes, ProductosLista } = req.body;
 
      try {
          if (!ID_clientes || !ProductosLista || !Array.isArray(ProductosLista) || ProductosLista.length === 0) {
              return res.status(400).json({ message: 'Faltan datos para crear la venta' });
          }
 
          let total_venta = 0;
          const combinacionesUnicas = new Set(); // Evitar combinaciones duplicadas de insumos
 
          // Crear el pedido
          const Nuevaventa = await Ventas.create({
              fecha: Date.now(),
              ID_clientes,
              precio_total: total_venta,
              ID_estado_venta: 1, // Asumimos que "1" significa "pendiente" o similar
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
              if (Array.isArray(productos.Producto_Venta)) {


                const productoVenta = await Producto_Ventas.create({
                  ID_venta: Nuevaventa.ID_venta,
                  ID_producto: producto.ID_producto,
                  cantidad:producto.cantidad || 1,
                  precio_neto: producto.precio_neto,
                  sub_total: 0, // Se actualizará luego
              });
                for( const producto_ventas of  productos.Producto_Venta){

                     
                    // ADICIONES
                    for (const adiciones of producto_ventas.Adiciones) {
                      let adiciones_total = 0;
 
                            const nuevaAdicion = await Adiciones.create({
                                cantidad: adiciones.cantidad || 1,
                                total: 0, // Se actualizará luego
                                ID_producto_ventas: productoVenta.ID_producto_venta,
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
 
                          
                        }
                    }
 
                      // Actualizar el total de la adición
                     adiciones_total *= (adiciones.cantidad || 1);
                    await nuevaAdicion.update({ total: adiciones_total });
 
                      sub_total_insumos += adiciones_total; // Sumar subtotal de la adición al producto
                }
                    // Calcular y actualizar el subtotal de ProductoVenta
                const sub_total_producto = (producto.precio_neto * productos.cantidad) + sub_total_insumos;
                total_venta += sub_total_producto;
                console.log('SUBTOTAL', sub_total_producto, 'SUBTOTAL DE INSUMOS',sub_total_insumos)
                 
                  await productoVenta.update({ sub_total: sub_total_producto});
                }
              }
 
           
 
             
          }
 
          // Actualizar el total del pedido
          await Nuevaventa.update({ precio_total: total_venta });
 
          return res.status(201).json({ status: 201, message: 'Se ha creado el pedido', ProductosLista });
      } catch (err) {
          console.error(err);
          if (!res.headersSent) {
              return res.status(500).json({ message: 'Error al crear el pedido', error: err.message });
          }
      }
  }

module.exports = {
    getVentas,
    getVentasID,
    CrearVentas
}
