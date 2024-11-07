const express = require('express');
const {request , response} = require('express');

const db = require('../../models');
const Estado = db.EstadoPedido;

    const 
    getState = async (res,req) => {
      const estado = await Estado.findAll();
        res.status(200).json(estado);
    },
        
    getStateID = async (id) => {
      const estado= await Estado.findByPk(id);
        return estado;
    } ,

    CreateState = async (datos) => {
        const estado = await Estado.create(datos);
        return estado ;

    };
        
    PatchState= async (id, datos) => {
      const [updated] = await Estado.update(datos, {
        where: { ID_estado:id },
      });

      if (updated) {
        const updatedState = await Estado.findByPk(id);
        return updatedState;

      }else{
        return { status: 404, message: 'State not found' };
      }
    },

    DeleteState = async (id) => {
      const deleted = await Estado.destroy({ where: {ID_estado: id}, });
      if (deleted) {
        return deleted;
      }else{
        return {status: 404, message: 'State not found' };
      }
    } 


        
        

module.exports = {
    getState,
    getStateID,
    CreateState,
    PatchState,
    DeleteState
}