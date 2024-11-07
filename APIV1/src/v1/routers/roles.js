const express = require('express');
const router = express.Router();
const controllerRoles = require('../../controllers/roles');

router
    .get('/', controllerRoles.obtenerRoles)
    .get('/:id', controllerRoles.obtenerRolesPorId)
    .post('/', controllerRoles.CrearRoles)
    .put('/:id', controllerRoles.ModificarRoles)
    .delete('/:id', controllerRoles.eliminarRoles)


module.exports = router;
