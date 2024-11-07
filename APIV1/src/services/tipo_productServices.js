const express = require('express');
const {request , response} = require('express');

//const Pedidos = db.Pedidos;
const { Tipo_productos  } = require('../../models');


    const 
    Listar_tipo = async () => {
        const Tipo_producto  = await Tipo_productos.findAll();
        return Tipo_producto;
    },

    Listar_tipo_ID = async (id) => {
        const Tipo_producto  = await Tipo_productos.findByPk(id)
        return Tipo_producto ;
    },


    Agregar_tipo = async (data) => {
        const Tipo_producto  = await Tipo_productos.create(data)
        return Tipo_producto ;
    },


    Actualizar_tipo = async (id,data) => {
        const [Tipo_producto]  = await Tipo_productos.update(data
            , {where: 
                { ID_tipo_producto: id}
            })
            if (Tipo_producto) {
                const updatedTipo = await Tipo_productos.findByPk(id);
                return updatedTipo;
            }
    },


    Eliminar_tipo = async (id) =>{

    const eliminar = await Tipo_productos.destroy({ where: {ID_tipo_producto: id}, });
            if (eliminar) {
                return eliminar;
            }else{
                return {}
            }
    }

module.exports = {
    Listar_tipo,
    Listar_tipo_ID,
    Agregar_tipo,
    Actualizar_tipo,
    Eliminar_tipo
}