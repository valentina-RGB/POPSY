const express = require('express');
const Joi = require('joi');

// Esquema de validación para crear un insumo
const createInsumosSchema = Joi.object({
    ID_tipo_insumo: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'El tipo de insumo debe ser un número entero.',
        'number.integer': 'El tipo de insumo debe ser un número entero.',
        'number.positive': 'El tipo de insumo debe ser un número positivo.',
        'any.required': 'El tipo de insumo es requerido.',
      }),
    descripcion_insumo: Joi.string().max(50).required()
      .messages({
        'string.base': 'La descripción del insumo debe ser una cadena de texto.',
        'string.max': 'La descripción del insumo no puede tener más de 50 caracteres.',
        'any.required': 'La descripción del insumo es requerida.',
      }),
    estado_insumo: Joi.string().valid('D', 'A').default('D').required()
      .messages({
        'string.base': 'El estado del insumo debe ser una cadena de texto.',
        'any.only': 'El estado del insumo debe ser "D" (Desactivado) o "A" (Activo).',
        'any.required': 'El estado del insumo es requerido.',
      }),
      precio: Joi.number().min(0).optional()
      .messages({
        'number.base': 'El precio debe ser un número.',
        'number.min': 'El precio debe ser un número positivo o cero.',
      }),
    
    stock: Joi.object({
      stock_min: Joi.number().integer().min(0).required()
        .messages({
          'number.base': 'El stock mínimo debe ser un número entero.',
          'number.integer': 'El stock mínimo debe ser un número entero.',
          'number.min': 'El stock mínimo no puede ser negativo.',
          'any.required': 'El stock mínimo es requerido.',
        }),
      stock_max: Joi.number().integer().min(0).required()
        .messages({
          'number.base': 'El stock máximo debe ser un número entero.',
          'number.integer': 'El stock máximo debe ser un número entero.',
          'number.min': 'El stock máximo no puede ser negativo.',
          'any.required': 'El stock máximo es requerido.',
        }),
      stock_actual: Joi.number().integer().min(0).optional()
        .messages({
          'number.base': 'El stock actual debe ser un número entero.',
          'number.integer': 'El stock actual debe ser un número entero.',
          'number.min': 'El stock actual no puede ser negativo.',
        }),
    }).required()
      .messages({
        'object.base': 'El objeto de stock es requerido y debe contener las propiedades adecuadas.',
      }),
  }).messages({
    'object.base': 'El cuerpo de la solicitud no es válido.',
  });
  


// Esquema de validación para actualizar un insumo
const updateInsumosSchema = Joi.object({
    ID_tipo_insumo: Joi.number().integer().positive().optional()
      .messages({
        'number.base': 'El tipo de insumo debe ser un número entero.',
        'number.integer': 'El tipo de insumo debe ser un número entero.',
        'number.positive': 'El tipo de insumo debe ser un número positivo.'
      }),
    descripcion_insumo: Joi.string().max(50).optional()
      .messages({
        'string.base': 'La descripción del insumo debe ser una cadena de texto.',
        'string.max': 'La descripción del insumo no puede tener más de 50 caracteres.'
      }),
    estado_insumo: Joi.string().valid('D', 'A').optional()
      .messages({
        'string.base': 'El estado del insumo debe ser una cadena de texto.',
        'any.only': 'El estado del insumo debe ser "D" (Desactivado) o "A" (Activo).'
      }),
      precio: Joi.number().min(0).optional()
      .messages({
        'number.base': 'El precio debe ser un número.',
        'number.min': 'El precio debe ser un número positivo o cero.',
      }),
    stock: Joi.object({
      stock_min: Joi.number().integer().min(0).optional()
        .messages({
          'number.base': 'El stock mínimo debe ser un número entero.',
          'number.integer': 'El stock mínimo debe ser un número entero.',
          'number.min': 'El stock mínimo no puede ser negativo.'
        }),
      stock_max: Joi.number().integer().min(0).optional()
        .messages({
          'number.base': 'El stock máximo debe ser un número entero.',
          'number.integer': 'El stock máximo debe ser un número entero.',
          'number.min': 'El stock máximo no puede ser negativo.'
        }),
      stock_actual: Joi.number().integer().min(0).optional()
        .messages({
          'number.base': 'El stock actual debe ser un número entero.',
          'number.integer': 'El stock actual debe ser un número entero.',
          'number.min': 'El stock actual no puede ser negativo.'
        }),
    }).optional()
      .messages({
        'object.base': 'El objeto de stock debe ser un objeto válido si se incluye.',
      }),
  }).messages({
    'object.base': 'El cuerpo de la solicitud no es válido.',
  });
  

// Función de validación para crear un insumo
function validateInsumos(req, res, next) {
    const { error } = createInsumosSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }
    next();
}

// Función de validación para actualizar un insumo
function validateUpdateInsumo(req, res, next) {
    const { error } = updateInsumosSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }
    next();
}

// Esquema de validación para crear un tipo de insumo
const createTipoInsumoSchema = Joi.object({
    descripcion_tipo: Joi.string().max(255).required()
        .messages({
            'string.base': 'La descripción del tipo de insumo debe ser una cadena de texto.',
            'string.max': 'La descripción del tipo de insumo no puede tener más de 255 caracteres.',
            'any.required': 'La descripción del tipo de insumo es requerida.'
        }),
});

// Esquema de validación para actualizar un tipo de insumo
const updateTipoInsumoSchema = Joi.object({
    descripcion_tipo: Joi.string().max(255).optional()
        .messages({
            'string.base': 'La descripción del tipo de insumo debe ser una cadena de texto.',
            'string.max': 'La descripción del tipo de insumo no puede tener más de 255 caracteres.'
        }),
});

// Función de validación para crear un tipo de insumo
function validateCreateTipoInsumo(req, res, next) {
    const { error } = createTipoInsumoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

// Función de validación para actualizar un tipo de insumo
function validateUpdateTipoInsumo(req, res, next) {
    const { error } = updateTipoInsumoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

module.exports = {
    validateInsumos,
    validateUpdateInsumo,
    validateCreateTipoInsumo,
    validateUpdateTipoInsumo
}
