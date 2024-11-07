// routes/tipoInsumo.js
const express = require('express');
const router = express.Router();
const TipoInsumosController = require('../../controllers/TipoInsumo');
const { validateCreateTipoInsumo, validateUpdateTipoInsumo, } = require('../../validation/validations_ISE');

router.get('/', TipoInsumosController.obtenerTiposInsumos);
router.get('/:id', TipoInsumosController.obtenerTipoInsumoPorId);
router.post('/', validateCreateTipoInsumo, TipoInsumosController.crearTipoInsumo);
router.put('/:id', validateUpdateTipoInsumo, TipoInsumosController.actualizarTipoInsumo);
router.delete('/:id', TipoInsumosController.eliminarTipoInsumo);

module.exports = router;
