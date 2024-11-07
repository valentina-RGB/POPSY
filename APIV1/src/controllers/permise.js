const express = require ('express');
const {request , response} = require('express');
const permiseService = require('../services/permiseService');

const 
    obtenerPermiso = async (req, res) => {
        try{
            
        return await permiseService.getPermiso(res,req);  
       
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    obtenerPermisoPorId = async (req, res) => {
        try {
            const {id} = req.params;
            const permiso = await permiseService.getPermisoID(id);

            if(permiso){
                res.status(200).json(permiso)      
            }else{
                res.status(404).json({message: 'permiso not found' })
            }               
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    crearPermiso = async  (req = request, res= response) => {
        try {        
            const permiso = await permiseService.CreatePermiso(req.body);
            res.status(201).json({ message: 'permise created successfully', permiso });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    } ,

    modificarPermiso = async (req = request, res= response) =>{
        try {
            const { id } = req.params;
            const updatepermise = await permiseService.PatchPermiso(id, req.body);

            if(updatepermise){
                res.status(200).json({ message: 'permise updated successfully', updatePermise });
            }
        }catch(error){
            res.status(400).json({ message: error.message });
            }     
    } ,

    eliminarPermiso= async (req = request, res= response) =>{
        const { id } = req.params;
            try{
                const dato = await permiseService.DeletePermiso(id);
                res.status(204).json({message: 'El permiso fue eliminado', dato});
            }catch(error){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
            }      
    }

module.exports = {
   obtenerPermiso,  
   obtenerPermisoPorId,
   crearPermiso,
   modificarPermiso,
   eliminarPermiso
}