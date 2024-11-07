const express = require('express');
const router = express.Router();
const controllerPermise_roles = require('../../controllers/Permise_roles');

router
    .get('/', controllerPermise_roles.obtenerPermiso_roles)
    .get('/:id', controllerPermise_roles.obtenerPermiso_rolesPorId)
    .post('/', controllerPermise_roles.crearPermiso_roles)
    .patch('/:id', controllerPermise_roles.modificarPermiso_roles)
    .delete('/:id', controllerPermise_roles.eliminarPermiso_roles)


module.exports = router;
