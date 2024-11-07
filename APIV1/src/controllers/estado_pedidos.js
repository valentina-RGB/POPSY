const express = require('express');
const {request , response} = require('express');
const StateService = require('../services/estado_pedidoServices');

const 
    obtenerEstado = async (req, res) => {
        try{

        return await StateService.getState(res,req);  
       
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    obtenerEstadoPorId = async (req, res) => {
        try {
            const {id} = req.params;
            const estados = await StateService.getStateID(id);

            if(estados){
                res.status(200).json(estados)      
            }else{
                res.status(404).json({message: 'State not found' })
            }               
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    CrearEstados = async  (req = request, res= response) => {
        try {        
            const estados = await StateService.CreateState(req.body);
            res.status(201).json({ message: 'State created successfully', estados });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    } ,

    ModificarEstados = async (req = request, res= response) =>{
        try {
            const { id } = req.params;
            const updatEstado = await StateService.PatchState(id, req.body);

            if(updatEstado){
                res.status(200).json({ message: 'State updated successfully', updatEstado });
            }
        }catch(error){
            res.status(400).json({ message: error.message });
            }     
    } ,

    EliminarEstado= async (req = request, res= response) =>{
        const { id } = req.params;
            try{
                const dato = await StateService.DeleteState(id);
                res.status(204).json({message: 'El dato fue eliminado', dato});
            }catch(error){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
            }      
    }

module.exports = {
    obtenerEstado,
    obtenerEstadoPorId,
    CrearEstados,
    ModificarEstados,
    EliminarEstado

}