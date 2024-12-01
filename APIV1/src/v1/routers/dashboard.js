const express = require('express');
const router = express.Router();
const { obtenerProductosMasVendidos, obtenerVentas, getInsumosCriticos } = require('../../controllers/dashboard');

// Ruta para obtener los productos más vendidos
router.get('/productos-mas-vendidos', obtenerProductosMasVendidos);
router.get('/ventas', obtenerVentas);
router.get('/insumos', getInsumosCriticos);

// Agrega aquí más rutas para el dashboard
module.exports = router;