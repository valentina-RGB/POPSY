const express = require('express');
const router = express.Router();
const controllerConfiguracion = require('../../controllers/configuracion');
// const {validateCategoria } = require('../../validation/validations_PCP');

router
    .get('/', controllerConfiguracion.obtenerConfiguracion)
    .get('/:id', controllerConfiguracion.obtenerConfiguracionesPorId)
    .post('/', controllerConfiguracion.CrearConfiguracion)
    .put('/:id', controllerConfiguracion.ModificarConfiguracion)
    .delete('/:id', controllerConfiguracion.eliminarConfiguracion)


module.exports = router;
