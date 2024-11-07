const express = require('express');
const {request , response} = require('express');

//const Pedidos = db.Pedidos;
const { Pedidos, Producto_Pedidos, Productos } = require('../../models');
const {ErrorNoEncontrado,ErrorSolicitudIncorrecta} = require ('../errors/bad')


    const 
    ListarDetalle = async () => {
        const producto_pedidos = await Producto_Pedidos.findAll();
        return producto_pedidos;
    },


        agregarDetalle = async (ID_pedidos, ID_productos, cantidad) =>{

        
        // Aqui hago la busqueda del precio neto del producto
        const precio_productos = await Productos.findAll(
                    {
                        where:{
                            ID_producto: ID_productos
                        },
                        attributes: ['precio_neto'],
                    }
            )


            if (precio_productos.length === 0) {  // Verifica si no se encontró el producto
                throw new ErrorNoEncontrado("El producto no se encuentra registrado :(");
            } 

            const precio_neto = precio_productos[0].precio_neto;



            const ExistenciaPedido = await Pedidos.findAll(
                {
                    where:{
                        ID_pedido: ID_pedidos,
                       
                    },
                    attributes: ['ID_pedido'],
                }
            )

            if (ExistenciaPedido.length === 0) {  // Verifica si no se encontró el producto
                throw new ErrorNoEncontrado("El pedido no se encuentra registrado :(");
            }     
            


        //Aqui verifico la existencia de un producto (Evito duplicados) 
        const DetalleExistencia = await Producto_Pedidos.findAll(
            {
                where:{
                    ID_pedidos: ID_pedidos,
                    ID_productos:ID_productos
                },
                attributes: ['precio_neto','sub_total'],
            }
        )


        


        if(DetalleExistencia!=0){

            const nuevo_neto = DetalleExistencia[0].precio_neto;
  
            const actualizarDetalle = await Producto_Pedidos.update(
                {
                    cantidad : cantidad,
                    precio_neto: nuevo_neto,
                    sub_total : nuevo_neto * cantidad
                },
                {
                    where:{
                        ID_productos: ID_productos
                    }
                }
            )

            //Aptualizo el pedido 

            const updatepedido = await Pedidos.update(
                { precio_total: DetalleExistencia[0].precio_neto * cantidad},
                {
                    where:{
                        ID_pedido: ID_pedidos
                    }
                }
            )
            
            return {message:'Detalle actualizado exitosamente'}
        
        
        }else{
        const nuevoDetalle = await Producto_Pedidos.create({
                ID_pedidos : ID_pedidos,
                ID_productos: ID_productos,
                cantidad: cantidad, 
                precio_neto: precio_neto,
                sub_total: precio_neto * cantidad 
        })

        const updatepedido = await Pedidos.update(
            { precio_total: precio_productos[0].precio_neto * cantidad},
            {
                where:{
                    ID_pedido: ID_pedidos
                }
            }
        )
        
        return {message:'Detalle agregado exitosamente', nuevoDetalle} 
        }
    },

    DeleteDetalles = async (id) => {
            const deleted = await Producto_Pedidos.destroy({ where: {ID_producto_pedido: id}, });
            if (deleted) {
                return (deleted);
            }else{
                return {status: 404, message: 'EL detalle no se encontro :(' };
            }
        } 

module.exports = {
    ListarDetalle,
    agregarDetalle,
    DeleteDetalles
}