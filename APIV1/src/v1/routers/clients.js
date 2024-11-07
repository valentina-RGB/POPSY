const express = require('express');
const router = express.Router();
const controllerClientes = require('../../controllers/clients');

router
    .get('/', controllerClientes.obtenerClientes)
    .get('/:id', controllerClientes.obtenerClientesPorId)
    .post('/', controllerClientes.CrearClientes)
    .put('/:id', controllerClientes.ModificarClientes)
    .delete('/:id', controllerClientes.eliminarClientes)


module.exports = router;
