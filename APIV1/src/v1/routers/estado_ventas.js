const express = require('express');
const router = express.Router();
const EstadoVentaController = require('../../controllers/Estado_Venta');


router.get('/', EstadoVentaController.obtenerEstadoVentas);
router.get('/:id', EstadoVentaController.obtenerEstadoVentasPorid);
router.post('/', EstadoVentaController.CrearEstadoVenta);
router.put('/:id',  EstadoVentaController.actualizarEstadoVenta);
router.delete('/:id', EstadoVentaController.eliminarEstadoVenta);

module.exports = router;