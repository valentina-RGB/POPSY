const express = require('express');
const router = express.Router();
const controllerAccess = require('../../controllers/autenticacion');

router
    
    .post('/login', controllerAccess.authenticateToken, controllerAccess.Iniciar_sesion)
    .post('/signup', controllerAccess.authenticateToken,
   
        controllerAccess.registrar
      
    )
   


module.exports = router;
