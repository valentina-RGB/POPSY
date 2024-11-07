const express = require('express');
const {request , response} = require('express');
const permise_rolesService = require('../services/permise_rolesService');

const 
    obtenerPermiso_roles = async (req, res) => {
        try{

        return await permise_rolesService.getPermise_roles(res,req);  
       
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    obtenerPermiso_rolesPorId = async (req, res) => {
        try {
            const {id} = req.params;
            const permiso_roles = await permise_rolesService.getPermise_rolesID(id);

            if(permiso_roles){
                res.status(200).json(permiso_roles)      
            }else{
                res.status(404).json({message: 'permiso_roles not found' })
            }               
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    crearPermiso_roles = async  (req = request, res= response) => {
        try {        
            const permiso_roles = await permise_rolesService.CreatePermise_roles(req.body);
            res.status(201).json({ message: 'permise_roles created successfully', permiso_roles });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    } ,

    modificarPermiso_roles = async (req = request, res= response) =>{
        try {
            const { id } = req.params;
            const updatepermise_roles = await permise_rolesService.PatchPermise_roles(id, req.body);

            if(updatepermise_roles){
                res.status(200).json({ message: 'permise_roles updated successfully', updatePermise_roles });
            }
        }catch(error){
            res.status(400).json({ message: error.message });
            }     
    } ,

    eliminarPermiso_roles= async (req = request, res= response) =>{
        const { id } = req.params;
            try{
                const dato = await permise_rolesService.DeletePermise_roles(id);
                res.status(204).json({message: 'El permiso_roles fue eliminado', dato});
            }catch(error){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
            }      
    }

module.exports = {
   obtenerPermiso_roles,  
   obtenerPermiso_rolesPorId,
   crearPermiso_roles,
   modificarPermiso_roles,
   eliminarPermiso_roles
}