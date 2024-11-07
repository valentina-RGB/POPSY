const express = require('express');
const {request , response} = require('express');
const clientsService = require('../services/clientsServices');

const 
    obtenerClientes = async (req, res) => {
        try{

        return await clientsService.getClient(res,req);  
       
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    obtenerClientesPorId = async (req, res) => {
        try {
            const {id} = req.params;
            const clientes = await clientsService.getClientsID(id);

            if(clientes){
                res.status(200).json(clientes)      
            }else{
                res.status(404).json({message: 'Clientes not found' })
            }               
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    CrearClientes = async  (req = request, res= response) => {
        try {        
            const clientes = await clientsService.CreateClients(req.body);
            res.status(201).json({ message: 'clientes created successfully', clientes });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    } ,

    ModificarClientes = async (req = request, res= response) =>{
        try {
            const { id } = req.params;
            const updateclientes = await clientsService.PatchClients(id, req.body);

            if(updateclientes){
                res.status(200).json({ message: 'Cliente updated successfully', updateclientes });
            }
        }catch(error){
            res.status(400).json({ message: error.message });
            }     
    } ,

    eliminarClientes= async (req = request, res= response) =>{
        const { id } = req.params;
            try{
                const dato = await clientsService.DeleteClients(id);
                res.status(204).json({message: 'El dato fue eliminado', dato});
            }catch(error){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
            }      
    }

module.exports = {
   obtenerClientes,  
   obtenerClientesPorId,
   CrearClientes,
   ModificarClientes,
   eliminarClientes
}