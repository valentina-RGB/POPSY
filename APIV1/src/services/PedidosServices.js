const express = require('express');
const {request , response} = require('express');

// const db = require('../../models');
//const Pedidos = db.Pedidos;
const {Productos_adiciones, Pedidos, Producto_Pedidos,Producto_insumos, Adiciones,Insumos, Adiciones_Insumos , Productos, Clientes} = require('../../models');


    const 
    getPedidos = async (res,req) => {
        const pedidos = await Pedidos.findAll({
            include: [
              {
                model: Productos,
                as: 'ProductosLista',
                through: {
                  model: Producto_Pedidos,  // Tabla intermedia entre Pedidos y Productos
                  attributes: ['cantidad', 'precio_neto', 'sub_total'],
                },
                include: [
                  {
                    model: Insumos,  // Relación entre Productos e Insumos
                    as: 'Insumos',   
                    attributes: ['descripcion_insumo', 'precio'], // Atributos del modelo Insumos
                    through: {
                      model:Producto_insumos,  // Tabla intermedia entre Productos e Insumos
                      attributes: ['cantidad'],  // Atributos de la tabla intermedia
                    },
                  },
                  {
                    model: Adiciones,  // Relación entre Productos y adiciones
                    as: 'adicion', 
                    through: {
                      model:Productos_adiciones,
                      attributes: ['cantidad']
                    },
                    include:[
                      {
                        model: Insumos,  // Relación entre Adiciones e Insumos
                        as: 'insumos', 
                        through: {
                          model:Adiciones_Insumos, 
                          attributes: ['cantidad'],
                        },
                        attributes: ['descripcion_insumo', 'precio'],
                      }
                    ] 
                  },
                ],
              },
            ],
          });
          
        res.status(200).json(pedidos);
    },
        
    getPedidosID = async (id) => {
        const pedidos = await Pedidos.findByPk(id,{
          include: [
            {
              model: Productos,
              as:'ProductosLista',
              through: {
                model: Producto_Pedidos,  // Tabla intermedia entre Pedidos y Productos
                attributes: ['cantidad', 'precio_neto', 'sub_total'],
              },
              include: [
                {
                  model: Insumos,  // Relación entre Productos e Insumos
                  as: 'Insumos',   
                  attributes: ['descripcion_insumo', 'precio'], // Atributos del modelo Insumos
                  through: {
                    model:Producto_insumos,  // Tabla intermedia entre Productos e Insumos
                    attributes: ['cantidad'],  // Atributos de la tabla intermedia
                  },
                },
                {
                  model: Adiciones,  // Relación entre Productos y adiciones
                  as: 'adicion', 
                  through: {
                    model:Productos_adiciones,
                    attributes: ['cantidad']
                  },
                  include:[
                    {
                      model: Insumos,  // Relación entre Adiciones e Insumos
                      as: 'insumos', 
                      through: {
                        model:Adiciones_Insumos, 
                        attributes: ['cantidad'],
                      },
                      attributes: ['descripcion_insumo', 'precio'],
                    }
                  ] 
                },
              ],
            },
          ],
        });
        return pedidos;
    } ,

    CrearPedidos = async (req= request, res= response) => {
      const {ID_estado_pedido,ID_clientes, ProductosLista} = req.body;

     
      let bandera = false; 
      let respuesta = "";

      if(ID_clientes){
        const clientes = await Clientes.findByPk(ID_clientes);
        if(!clientes){
          bandera = true;
          respuesta = "El cliente no esta registrado";
        }
      }

      if(!bandera){

        let totalPedido = 0;

        let TotalAdiciones = 0;

        let cantidad = 0;
        
        const Nuevopedido = await Pedidos.create({
          fecha: Date.now(),
          ID_clientes:ID_clientes,
          precio_total:totalPedido,
          ID_estado_pedido: ID_estado_pedido
        });

       

        if (Array.isArray(ProductosLista)) {
        
          for (const productos of ProductosLista) {

             console.log('holaaaaaaaa', ProductosLista, productos.adicion )
            
            if (productos && productos.Producto_Pedidos) {

              const subTotal = productos.precio_neto * productos.Producto_Pedidos.cantidad 
        
              // Añade el subtotal al total del pedido
              totalPedido += subTotal;
        
              // Crear la entrada en Producto_Pedidos
              await Producto_Pedidos.create({
                ID_pedidos: Nuevopedido.ID_pedido,
                ID_productos: productos.ID_producto,
                cantidad: productos.Producto_Pedidos.cantidad,
                precio_neto: productos.precio_neto,
                sub_total: subTotal + productos.adicion.Adiciones_Insumos,
              });


              // const NuevaAdicion = await Adiciones.create({
              //   cantidad:0,
              //   total: 0
              // });
        
            
            }
          
          
          
          // Manejo de adiciones, si aplica
          if (Array.isArray( productos.adicion)) {
            for (const adicion of  productos.adicion) {

              if (adicion && adicion.Adiciones_Insumos) {

                // const subTotalAdiciones =  adicion.Adiciones_Insumos.cantidad * adicion.Adiciones_Insumos.total;

                // const cantidadAdiciones = adicion.Adiciones_Insumos.cantidad;
                // // console.log("AQUI ESTOY!! ")
                // TotalAdiciones += subTotalAdiciones;

                // cantidad += cantidadAdiciones;
                
                // await Productos_adiciones.create({
                //   ID_Producto_adicion: productos.ID_producto,
                //   ID_adiciones: NuevaAdicion.ID_adicion,
                //   cantidad: adicion.Adiciones_Insumos.cantidad,
                //   total: adicion.Adiciones_Insumos.total,
                // });

                // await Adiciones_Insumos.create({
                //   ID_adicion_p: NuevaAdicion.ID_adicion,
                //   ID_insumo_p: adicion.ID_insumo,
                //   cantidad: adicion.Adiciones_Insumos.cantidad,
                //   total: adicion.precio * adicion.Adiciones_Insumos.cantidad ,
                // });

                 totalPedido += (adicion.Adiciones_Insumos.total * productos.Producto_Pedidos.cantidad);
              }
            }
          }
          }

            
        }

        console.log(`TOTAL: ${totalPedido}`)

        await Nuevopedido.update({
          precio_total: totalPedido
        });

        // await NuevaAdicion.update({
        //   cantidad:cantidad,
        //   total:TotalAdiciones
        // });

        return  { status: 201, message:'Se a creado el pedido', Nuevopedido};
      } else{
        return {status: 404, message: respuesta || 'Error no especificado' }; // Garantiza que siempre haya un mensaje       
    }
    

    },


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
        
    PatchPedidos = async (id, datos) => {
        const [updated] = await Pedidos.update(datos, {
        where: { ID_pedido:id },
    });

    if (updated) {
        const updatedPedidos = await Pedidos.findByPk(id);
        return updatedPedidos;
    }else{
        return { status: 404, message: 'Order not found' };
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