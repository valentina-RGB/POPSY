const express = require('express');
const {request , response} = require('express');

const db = require('../../models');
const Configuracion = db.Configuraciones;

    const 

    getConfiguracion= async (res,req) => {
        const configuracion = await Configuracion.findAll();
        res.status(200).json(configuracion);
    },
        
    getConfiguracionID = async (id) => {
    const configuracion = await Configuracion.findByPk(id);
        return configuracion;

    
    } ,



    CreateConfiguracion = async (datos) => {
        const configuracion = await Configuracion.create(datos);
        return configuracion;

    },
        
    PatchConfiguracion = async (id, datos) => {
        const [updated] = await Configuracion.update(datos, {
        where: { ID_configuracion:id },
    });

    if (updated) {
        const updatedConfiguracion = await Configuracion.findByPk(id);
        return updatedConfiguracion;
        }else{
        return { status: 404, message: 'categoria not found' };
    }
    },

    DeleteConfiguracion= async (id) => {
    const deleted = await Configuracion.destroy({ where: {ID_configuracion: id}, });
    if (deleted) {
        return deleted;
    }else{
        return {status: 404, message: 'categoria not found' };
    }
    }      

module.exports = {
    getConfiguracion,
    getConfiguracionID,
    CreateConfiguracion,
    PatchConfiguracion,
    DeleteConfiguracion
}