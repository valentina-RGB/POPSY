const express = require('express');
const router = express.Router();
const controllerCategories = require('../../controllers/categories');
const {validateCategoria } = require('../../validation/validations_PCP');

router
    .get('/', controllerCategories.obtenercategorias)
    .get('/:id', controllerCategories.obtenerCategoriasPorId)
    .post('/', controllerCategories.upload.single('imagen'), validateCategoria, controllerCategories.CrearCategorias)
    .put('/:id',controllerCategories.upload.single('imagen'), controllerCategories.ModificarCategorias)
    .delete('/:id', controllerCategories.eliminarCategorias)


module.exports = router;
