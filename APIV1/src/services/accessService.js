const express = require('express');
const {request , response} = require('express');

const db = require('../../models');
const acceso = db.Acceso;

    const 


    getAcceso = async (res,req) => {
      const acceso = await acceso.findAll();
        res.status(200).json(acceso);
    },
        
    getAccesoID = async (id) => {
      const accesos = await acceso.findByPk(id);
        return accesos;
    } ,

    CreateAcceso = async (datos) => {
        const accesos = await acceso.create(datos);
        return accesos;

    };
        
    PatchAcceso = async (id, datos) => {
      const [updated] = await acceso.update(datos, {
        where: { ID_acceso:id },
      });

      if (updated) {
        const updatedacceso = await acceso.findByPk(id);
        return updatedacceso;
      }else{
        return { status: 404, message: 'acceso not found' };
      }
    },

    DeleteAcceso = async (id) => {
      const deleted = await acceso.destroy({ where: {ID_acceso: id}, });
      if (deleted) {
        return deleted;
      }else{
        return {status: 404, message: 'acceso not found' };
      }


    } 


        
        

module.exports = {
    getAcceso,
    getAccesoID,
    CreateAcceso,
    PatchAcceso,
    DeleteAcceso,
}