// routes/tipoInsumo.js
const express = require('express');
const router = express.Router();
const TipoProductos = require('../../controllers/tipo_productos');


router.get('/', TipoProductos.obtener_tipo);
router.get('/:id', TipoProductos.obtener_tipo_ID);
router.post('/',TipoProductos.CrearTipo);
router.put('/:id',TipoProductos.ActualizarTipo);
router.delete('/:id', TipoProductos.EliminarTipo);

module.exports = router;
