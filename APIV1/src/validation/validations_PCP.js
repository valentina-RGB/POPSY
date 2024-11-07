const express = require('express');
const Joi = require('joi');

const categoriaSchema = Joi.object({
    descripcion: Joi.string()
      .max(100)
      .required()
      .pattern(/^[a-zA-Z\s]+$/)  
      .messages({
        'string.pattern.base': 'Descripción debe contener solo letras y espacios.'
      }),
    estado_categoria: Joi.string()
      .length(1)
      .valid('A', 'I')
      .default('A'),
    imagen: Joi.string().max(100).allow(null, '')
  });


const estadoPedidoSchema = Joi.object({
    descripcion: Joi.string()
      .max(50)
      .allow(null, '')
      .pattern(/^[a-zA-Z0-9\s]*$/)  // Letras, números y espacios permitidos, vacío permitido
      .messages({
        'string.pattern.base': 'Descripción debe contener solo letras, números y espacios.'
      })
});






// Middleware para validar la solicitud




// Middleware para validar la solicitud
function validateEstado(req, res, next) {
    const { error } = estadoPedidoSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
}


// Middleware para validar la solicitud
function validateCategoria(req, res, next) {
    const { error } = categoriaSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  }



module.exports = {
    validateCategoria,
    validateEstado
}