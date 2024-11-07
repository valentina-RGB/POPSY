const express = require('express');
const {request , response} = require('express');

const db = require('../../models');
const Cliente = db.Clientes;

  const 
    getClient = async (res,req) => {
      const cliente = await Cliente.findAll();
        res.status(200).json(cliente);
    },
        
    getClientsID = async (id) => {
      const clientes = await Cliente.findByPk(id);
        return clientes;
    } ,

    CreateClients = async (datos) => {
        const clientes = await Cliente.create(datos);
        return clientes;

    },
        
    PatchClients = async (id, datos) => {
      const [updated] = await Cliente.update(datos, {
        where: { ID_cliente:id },
      });

      if (updated) {
        const updatedCliente = await Cliente.findByPk(id);
        return updatedCliente;
      }else{
        return { status: 404, message: 'Cliente not found' };
      }
    },

    DeleteClients = async (id) => {
      const deleted = await Cliente.destroy({ where: {ID_cliente: id}, });
      if (deleted) {
        return deleted;
      }else{
        return {status: 404, message: 'cliente not found' };
      }


    } 


        
        

module.exports = {
    getClient,
    getClientsID,
    CreateClients,
    PatchClients,
    DeleteClients,
}