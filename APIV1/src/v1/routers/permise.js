const express = require('express');
const router = express.Router();
const controllerPermise = require('../../controllers/permise');

router
    .get('/', controllerPermise.obtenerPermiso)
    .get('/:id', controllerPermise.obtenerPermisoPorId)
    .post('/', controllerPermise.crearPermiso)
    .patch('/:id', controllerPermise.modificarPermiso)
    .delete('/:id', controllerPermise.eliminarPermiso)


module.exports = router;
