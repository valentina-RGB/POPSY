const express = require('express');
const router = express.Router();
const StockInsumosController = require('../../controllers/StockController');
const { updateStockInsumoSchema } = require('../../validation/validations_ISE');

router.get('/', StockInsumosController.obtenerStockInsumos);
router.get('/:id', StockInsumosController.obtenerStockInsumoPorId);
router.post('/:id/adiciones', StockInsumosController.agregarStock);
router.delete('/:id', StockInsumosController.eliminarStockInsumo);

module.exports = router;