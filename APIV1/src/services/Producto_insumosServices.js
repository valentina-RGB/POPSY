const express = require("express");
const { request, response } = require("express");

//const Pedidos = db.Pedidos;
const { Insumos, Producto_insumos, Productos } = require("../../models");
const {ErrorNoEncontrado} = require ('../errors/bad')

const ListarPI = async () => {
    const respuesta = await Producto_insumos.findAll();
    return respuesta;
  },

  ListarPI_ID = async (id) => {
    const respuesta = await Producto_insumos.findByPk(id);
    if (respuesta){ 
    return respuesta;
    }
  },

  AgregarPI = async (ID_insumos, ID_productos, cantidad,configuracion) => {
    

    //VALIDAR QUE EXISTAN
    const Existencia_producto = await Productos.findAll({
      where: {
        ID_producto: ID_productos,
      },
      attributes: ["ID_producto"],
    });


    const Existencia_insumo = await Insumos.findAll({
        where: {
          ID_insumo: ID_insumos,
        },
        attributes: ["ID_insumo"],
      });

    if (Existencia_producto.length === 0) {
       throw new ErrorNoEncontrado("El producto no se encontra registrado :(");
    }



    if (Existencia_insumo.length === 0) {
      throw new ErrorNoEncontrado("El insumo no se encuentra registrado :(");
    }

    //Aqui verifico la existencia del producto y insumo en la tabla productos_insumos
    const DetalleExistencia = await Producto_insumos.findAll({
      where: {
        ID_productos_tipo: ID_productos,
        ID_insumos_tipo: ID_insumos,
      },
      attributes: ["cantidad"],
    });

    if (DetalleExistencia != 0) {

      const nuevo_detalle = DetalleExistencia[0].cantidad;

      const Actualizar = await Producto_insumos.update(
        {
          ID_insumos_tipo: ID_insumos,
          ID_productos_tipo: ID_productos,
          cantidad: cantidad + nuevo_detalle,
          configuracion:configuracion
        },
        {
          where: {
            ID_productos_tipo: ID_productos,
            ID_insumos_tipo: ID_insumos
          },
        }
      );

      return { message: "Detalle actualizado exitosamente" };
    } else {

      const nuevoDetalle = await Producto_insumos.create({
        ID_insumos_tipo: ID_insumos,
        ID_productos_tipo: ID_productos,
        cantidad: cantidad,
      });

      return { message: "Detalle agregado exitosamente", nuevoDetalle };
    }
  },


  EliminarPI = async (id) => {
    const deleted = await Producto_insumos.destroy({
      where: { ID_producto_insumos: id },
    });
    if (deleted) {
      return deleted;
    } else {
      []
    }
  },

  ActualizarPI = async (id, ID_insumo, ID_producto, cantidad) =>{
    
    const Actualizar = await Producto_insumos.update(
      {
        ID_insumos_tipo: ID_insumo,
        ID_productos_tipo: ID_producto,
        cantidad: cantidad,
        configuracion:configuracion
      },
      {
        where: {
          ID_producto_insumo: id,
        
        },
      }
    );
    if(Actualizar){
      return Actualizar
    }else{
      []
    }

    
  }

module.exports = {
  ListarPI,
  ListarPI_ID,
  AgregarPI,
  EliminarPI,
  ActualizarPI
};
