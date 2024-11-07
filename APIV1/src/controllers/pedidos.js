const express = require('express');
const {request , response} = require('express');
const pedidosService = require('../services/PedidosServices');

const 
    obtenerpedidos = async (req, res) => {
        try{

        return await pedidosService.getPedidos(res,req);    
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    obtenerPedidosPorId = async (req, res) => {
        try {
            const {id} = req.params;
            const pedidos = await pedidosService.getPedidosID(id);

            if(pedidos){
                res.status(200).json(pedidos)      
            }else{
                res.status(404).json({message: 'Order not found' })
            }               
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    CrearPedidos = async  (req = request, res= response) => {
        try {        
            const pedidos = await pedidosService.CrearPedidos(req,res);

            if(pedidos){
                res.json(pedidos);
            }
            
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    
    } ,

    ModificarPedidos = async (req = request, res= response) =>{
        try {
            const { id } = req.params;
            const updatePedidos = await pedidosService.PatchPedidos(id, req.body);

            if(updatePedidos){
                res.status(200).json({ message: 'Order updated successfully', updatePedidos });
            }
        }catch(error){
            res.status(400).json({ message: error.message });
            }     
    } ,

    eliminarPedidos= async (req = request, res= response) =>{
        const { id } = req.params;
            try{
                const dato = await pedidosService.DeletePedidos(id);
                res.status(204).json({message: 'El dato fue eliminado', dato});
            }catch(error){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
            }      
    }

module.exports = {
    obtenerpedidos,
    obtenerPedidosPorId,
    CrearPedidos,
    ModificarPedidos,
    eliminarPedidos
}