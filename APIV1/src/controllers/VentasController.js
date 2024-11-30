const express = require('express');
const { request, response } = require('express');
const ventasService = require('../services/VentasServices');
const { Ventas, Estado_ventas } = require('../../models');

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
    const { id } = req.params;
    const { ID_estado_venta } = req.body;

    console.log('ID de venta:', id);
    console.log('Nuevo estado:', ID_estado_venta);

    try {
        // Verificar primero los estados existentes
        const estadosDisponibles = await Estado_ventas.findAll();
        console.log('Estados disponibles:', estadosDisponibles.map(e => e.toJSON()));

        // Buscar la venta
        const venta = await Ventas.findByPk(id);

        console.log('Venta encontrada:', venta ? venta.toJSON() : 'No encontrada');

        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Verificar si el estado de venta existe
        const estadoVenta = await Estado_ventas.findByPk(ID_estado_venta);
        
        console.log('Estado encontrado:', estadoVenta ? estadoVenta.toJSON() : 'No encontrado');

        if (!estadoVenta) {
            return res.status(400).json({ error: 'Estado de venta no encontrado' });
        }

        // Actualizar la venta
        venta.ID_estado_venta = ID_estado_venta;
        
        try {
            await venta.save();
            console.log('Venta después de guardar:', venta.toJSON());
        } catch (saveError) {
            console.error('Error específico al guardar:', saveError);
            console.error('Detalles del error:', saveError.errors || saveError.message);
            return res.status(500).json({ 
                error: 'Error al guardar la venta',
                details: saveError.errors ? saveError.errors.map(e => e.message) : saveError.message
            });
        }

        res.status(200).json({ 
            message: 'Estado de venta actualizado', 
            venta: venta.toJSON() 
        });

    } catch (error) {
        console.error('Error al actualizar estado de venta:', error);
        console.error('Detalles del error:', error.errors || error.message);
        res.status(500).json({ 
            error: 'Ocurrió un error al actualizar el estado de la venta.',
            details: error.errors ? error.errors.map(e => e.message) : error.message
        });
    }
};

// Eliminar una venta

module.exports = {
    CrearVentas,
    getAllVentas,
    getVentaById,
    updateEstadoVenta,

};
