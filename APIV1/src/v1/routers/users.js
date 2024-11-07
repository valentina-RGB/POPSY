const express = require('express');
const router = express.Router();
const controllerUsers = require('../../controllers/users');

router
    .get('/', controllerUsers.obtenerUsers)
    .get('/:id', controllerUsers.obtenerUsersPorId)
    .post('/', controllerUsers.CrearUsers)
    .put('/:id', controllerUsers.ModificarUsers)
    .delete('/:id', controllerUsers.eliminarUsers)


module.exports = router;
