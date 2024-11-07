const express = require('express');
const {request , response} = require('express');
const rolesService = require('../services/rolesService');

const 
    obtenerRoles = async (req, res) => {
        try{

        return await rolesService.getRol(res,req);  
       
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    obtenerRolesPorId = async (req, res) => {
        try {
            const {id} = req.params;
            const roles = await rolesService.getRolesID(id);

            if(roles){
                res.status(200).json(roles)      
            }else{
                res.status(404).json({message: 'roles not found' })
            }               
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    CrearRoles = async  (req = request, res= response) => {
        try {        
            const roles = await rolesService.CreateRoles(req.body);
            res.status(201).json({ message: 'roles created successfully', roles });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    } ,

    ModificarRoles = async (req = request, res= response) =>{
        try {
            const { id } = req.params;
            const updateroles = await rolesService.PatchRoles(id, req.body);

            if(updateroles){
                res.status(200).json({ message: 'Rol updated successfully', updateroles });
            }
        }catch(error){
            res.status(400).json({ message: error.message });
            }     
    } ,

    eliminarRoles= async (req = request, res= response) =>{
        const { id } = req.params;
            try{
                const dato = await rolesService.DeleteRoles(id);
                res.status(204).json({message: 'El dato fue eliminado', dato});
            }catch(error){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
            }      
    }

module.exports = {
   obtenerRoles,  
   obtenerRolesPorId,
   CrearRoles,
   ModificarRoles,
   eliminarRoles
}