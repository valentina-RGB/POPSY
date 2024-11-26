const express = require('express');
const router = express.Router();
const { obtenerProductosMasVendidos, obtenerVentas } = require('../../controllers/dashboard');

// Ruta para obtener los productos más vendidos
router.get('/productos-mas-vendidos', obtenerProductosMasVendidos);
router.get('/ventas', obtenerVentas);

// Agrega aquí más rutas para el dashboard
module.exports = router;