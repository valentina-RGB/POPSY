const express = require('express');
const {request , response} = require('express');
const usersService = require('../services/usersService');

const 
    obtenerUsers = async (req, res) => {
        try{

        return await usersService.getUser(res,req);  
       
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    obtenerUsersPorId = async (req, res) => {
        try {
            const {id} = req.params;
            const users = await usersService.getUsersID(id);

            if(users){
                res.status(200).json(users)      
            }else{
                res.status(404).json({message: 'users not found' })
            }               
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    CrearUsers = async  (req = request, res= response) => {
        try {        
            const users = await usersService.CreateUsers(req.body);
            res.status(201).json({ message: 'users created successfully', users });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    } ,

    ModificarUsers = async (req = request, res= response) =>{
        try {
            const { id } = req.params;
            const updateusers = await usersService.PatchUsers(id, req.body);

            if(updateusers){
                res.status(200).json({ message: 'users updated successfully', updateusers });
            }
        }catch(error){
            res.status(400).json({ message: error.message });
            }     
    } ,

    eliminarUsers = async (req = request, res= response) =>{
        const { id } = req.params;
            try{
                const dato = await usersService.DeleteUsers(id);
                res.status(204).json({message: 'El dato fue eliminado', dato});
            }catch(error){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
            }      
    }

module.exports = {
   obtenerUsers,  
   obtenerUsersPorId,
   CrearUsers,
   ModificarUsers,
   eliminarUsers
}