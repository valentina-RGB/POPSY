// routes/insumos.js
const express = require('express');
const router = express.Router();
const DetalleController = require('../../controllers/detalle_pedido');

router.get('/', DetalleController.ObtenerDetalles);
router.post('/', DetalleController.CrearDetalles);
router.delete('/:id', DetalleController.EliminarDetalle);



module.exports = router;
