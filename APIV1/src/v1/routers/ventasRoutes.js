const express = require('express');
const router = express.Router();
const ventasController = require('../../controllers/VentasController');
router.post('/', ventasController.CrearVentas);
router.get('/', ventasController.getAllVentas);
router.get('/:id', ventasController.getVentaById);
router.put('/:id/estado', ventasController.updateEstadoVenta);
module.exports = router;
