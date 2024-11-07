const express = require('express');
const {request , response} = require('express');

const db = require('../../models');
//const Pedidos = db.Pedidos;
const { Adiciones, Insumos, Adiciones_insumo } = require('../../models');

    const 


    getAdiciones = async (res,req) => {
        const adiciones = await Adiciones.findAll(
                {
                  include:[
                   {
                    model: Adiciones,
                    as: 'Adiciones',
                    attributes:['cantidad','descripcion','total']
                   }
                  ]
                }
        );
        res.status(200).json(pedidos);
    }
        
    // getPedidosID = async (id) => {
    //     const pedidos = await Pedidos.findByPk(id);
    //     return pedidos;
    // } ,

    // CrearPedidos = async (datos) => {
    //     const pedidos = await Pedidos.create(datos);
    //     return pedidos;

    // },

   

// Crear un nuevo pedido y detalles del pedido
//     CrearPedidos = async (req, res) => {
//     try {
//         const { ID_clientes, productos } = req.body; // productos es un array de objetos con ID_productos y cantidad

//         // Crear un nuevo pedido
//         const nuevoPedido = await Pedidos.create({
//             ID_clientes,
//             fecha: new Date(),
//             precio_total: 0, // Esto se actualizará después
//             ID_estado_pedido: 1 // Por ejemplo, un estado inicial
//         });

//         let precioTotal = 0;

//         // Crear detalles del pedido
//         for (let prod of productos) {
//             const producto = await Productos.findByPk(prod.ID_productos);
//             if (!producto) {
//                 return res.status(404).json({ message: `Producto con ID ${prod.ID_productos} no encontrado` });
//             }

//             const precioNeto = producto.precio_neto;
//             const precioTotalProducto = precioNeto * prod.cantidad;
//             precioTotal += precioTotalProducto;

//             await Producto_Pedidos.create({
//                 ID_pedidos: nuevoPedido.ID_pedido,
//                 ID_productos: prod.ID_productos,
//                 cantidad: prod.cantidad,
//                 precio_neto: precioNeto,
//                 precio_total: precioTotalProducto,
//                 fecha: new Date()
//             });
//         }

//         // Actualizar el precio total del pedido
//         nuevoPedido.precio_total = precioTotal;
//         await nuevoPedido.save();

//         res.status(201).json(nuevoPedido);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error al crear el pedido', error });
//     }
// },
        
    // PatchPedidos = async (id, datos) => {
    //     const [updated] = await Pedidos.update(datos, {
    //     where: { ID_pedido:id },
    // });

    // if (updated) {
    //     const updatedPedidos = await Pedidos.findByPk(id);
    //     return updatedPedidos;
    // }else{
    //     return { status: 404, message: 'Order not found' };
    // }
    // },

    // DeletePedidos = async (id) => {
    //     const deleted = await Pedidos.destroy({ where: {ID_pedido: id}, });
    //     if (deleted) {
    //     return deleted;
    // }else{
    //     return {status: 404, message: 'Order not found' };
    // }


    // } 


        
        

module.exports = {
    getAdiciones
}