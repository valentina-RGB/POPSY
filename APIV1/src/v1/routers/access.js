const express = require('express');
const router = express.Router();
const controllerAccess = require('../../controllers/access');

router
    .get('/', controllerAccess.obtenerAcceso)
    .get('/:id', controllerAccess.obtenerAccesoPorId)
    .post('/', controllerAccess.CrearAcceso)
    .patch('/:id', controllerAccess.ModificarAcceso)
    .delete('/:id', controllerAccess.eliminarAcceso)


module.exports = router;
