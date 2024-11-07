// routes/tipoInsumo.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/productos_insumos');


router.get('/', controller.obtener_detalle);
router.get('/:id', controller.obtener_detalleID);
router.post('/',controller.CrearDetalle);
router.put('/:id',controller.ActualizarDetalle);
router.delete('/:id', controller.EliminarDetalle);

module.exports = router;
