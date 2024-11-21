const express = require('express');
const { request, response } = require('express');
const ventasService = require('../services/VentasServices');
const Estado_ventas = require('../../models/Estado_ventas');

// Obtener todas las ventas
const getAllVentas = async (req, res) => {
    try {
        return await ventasService.getVentas(res, req);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVentaById = async (req, res) => {
    try {
        const {id} = req.params;
        const ventas = await ventasService.getVentasID(id);

        if(ventas){
            res.status(200).json(ventas)      
        }else{
            res.status(404).json({message: 'Venta no encontrada' })
        }               
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

CrearVentas = async  (req = request, res= response) => {
    try {        
        const ventas = await ventasService.CrearVentas(req,res);

        if(ventas){
            // res.json(pedidos);
        }
        
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }

};

const updateEstadoVenta = async (req, res) => {
    const { id } = req.params; // ID de la venta
    const { ID_estado_venta } = req.body; // Nuevo estado

    try {
        // Verificar si la venta existe
        const venta = await Ventas.findByPk(id);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Verificar si el estado de venta existe
        const estadoVenta = await Estado_ventas.findByPk(ID_estado_venta);
        if (!estadoVenta) {
            return res.status(400).json({ error: 'Estado de venta no encontrado' });
        }

        // Actualizar la venta
        venta.ID_estado_venta = ID_estado_venta;
        await venta.save();

        res.status(200).json({ message: 'Estado de venta actualizado', venta });
    } catch (error) {
        console.error('Error al actualizar estado de venta:', error);
        res.status(500).json({ error: 'Ocurrió un error al actualizar el estado de la venta.' });
    }
};

// Eliminar una venta
deleteVenta= async (req = request, res= response) =>{
    const { id } = req.params;
        try{
            const dato = await ventasService.DeleteVentas(id);
            res.status(204).json({message: 'El dato fue eliminado', dato});
        }catch(error){
            const statusCode = error.status || 500;
            res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
        }      
}

module.exports = {
    CrearVentas,
    getAllVentas,
    getVentaById,
    updateEstadoVenta,
    deleteVenta

};
