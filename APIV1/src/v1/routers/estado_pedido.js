const express = require('express');
const router = express.Router();
const controllerCategories = require('../../controllers/estado_pedidos');
const { validateEstado } = require('../../validation/validations_PCP');

router
    .get('/', controllerCategories.obtenerEstado)
    .get('/:id', controllerCategories.obtenerEstadoPorId)
    .post('/', validateEstado,controllerCategories.CrearEstados)
    .put('/:id', controllerCategories.ModificarEstados)
    .delete('/:id', controllerCategories.EliminarEstado)


module.exports = router;
