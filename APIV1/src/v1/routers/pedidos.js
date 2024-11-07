// routes/insumos.js
const express = require('express');
const router = express.Router();
const PedidosController = require('../../controllers/pedidos');
//const { validateProducto } = require('../../validation/validationsProductos');


router.get('/', PedidosController.obtenerpedidos);
router.get('/:id', PedidosController.obtenerPedidosPorId);
router.post('/', PedidosController.CrearPedidos);
router.put('/:id', PedidosController.ModificarPedidos);
router.delete('/:id', PedidosController.eliminarPedidos);

module.exports = router;
