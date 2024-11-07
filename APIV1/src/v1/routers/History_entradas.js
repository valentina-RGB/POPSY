const express = require('express');
const router = express.Router();
const historialEntradasController = require('../../controllers/HistoryEntrada');

// Obtener todo el historial de entradas
router.get('/', historialEntradasController.getAllEntradas);

// Obtener una entrada específica por ID
router.get('/:id', historialEntradasController.getEntradaById);

// Crear una nueva entrada en el historial
router.post('/', historialEntradasController.createEntrada);

// Editar una entrada por ID
router.put('/:id', historialEntradasController.updateEntrada);

// Eliminar una entrada por ID
router.delete('/:id', historialEntradasController.deleteEntrada);

module.exports = router;
