const express = require('express');
const {request , response} = require('express');
const configuracionServices = require('../services/configuracionServices');

const 
    obtenerConfiguracion = async (req, res) => {
        try{

        return await configuracionServices.getConfiguracion(res,req);  
       
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    obtenerConfiguracionesPorId = async (req, res) => {
        try {
            const {id} = req.params;
            const configuracion = await configuracionServices.getConfiguracionID(id);

            if(configuracion){
                res.status(200).json(configuracion)      
            }else{
                res.status(404).json({message: 'configuration not found' })
            }               
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    CrearConfiguracion = async  (req = request, res= response) => {
        try {        
            const configuracion = await configuracionServices.CreateConfiguracion(req.body);
            res.status(201).json({ message: 'Configuration created successfully', configuracion });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    } ,

    ModificarConfiguracion = async (req = request, res= response) =>{
        try {
            const { id } = req.params;
            const updateConfiguracion = await configuracionServices.PatchConfiguracion(id, req.body);

            if(updateConfiguracion){
                res.status(200).json({ message: 'Categoria updated successfully', updateConfiguracion });
            }
        }catch(error){
            res.status(400).json({ message: error.message });
            }     
    } ,

    eliminarConfiguracion= async (req = request, res= response) =>{
        const { id } = req.params;
            try{
                const dato = await configuracionServices.DeleteConfiguracion(id);
                res.status(204).json({message: 'El dato fue eliminado', dato});
            }catch(error){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
            }      
    }

module.exports = {
  obtenerConfiguracion,
  obtenerConfiguracionesPorId,
  CrearConfiguracion,
  ModificarConfiguracion,
  eliminarConfiguracion
}