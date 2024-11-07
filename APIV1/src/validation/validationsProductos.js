const Joi = require('joi');

// Definir el esquema de validación usando Joi con expresiones regulares
const productSchema = Joi.object({
    ID_producto: Joi.number()
        .integer()
        .positive()
        .required()
        .description('Identificador único del producto')
        .example(1),
    descripcion: Joi.string()
        .max(255)
        .regex(/^[a-zA-Z\s]+$/)
        .required()
        .description('Descripción del producto')
        .example('Salpicón'),
    precio_neto: Joi.number()
        .positive()
        .precision(2)
        .required()
        .description('Precio neto del producto')
        .example(5500),
    estado_producto: Joi.string()
        .valid('Disponible', 'No Disponible')
        .required()
        .description('Estado del producto')
        .example('Disponible'),
    ID_tipo_productos: Joi.number()
        .integer()
        .positive()
        .required()
        .description('Identificador del tipo de producto')
        .example(1),
    ID_categoria: Joi.number()
        .integer()
        .positive()
        .required()
        .description('Identificador de la categoría del producto')
        .example(2),
    imagen: Joi.string()
        .regex(/^https?:\/\/(.*)/)
        .allow(null)
        .description('URL de la imagen del producto')
        .example(null)
});

function validateProducto(req, res, next) {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  }

const crearPedido = async (req, res) => {
    const { error, value } = pedidoSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { ID_usuario, productos } = value;

    try {
        // Crear el pedido
        const pedido = await Pedido.create({ ID_usuario });

        // Crear los detalles del pedido
        const detallesPedido = productos.map(producto => ({
            ID_pedido: pedido.ID_pedido,
            ID_producto: producto.ID_producto,
            cantidad: producto.cantidad,
            precio_neto: producto.precio_neto,
            precio_total: producto.cantidad * producto.precio_neto
        }));

        await Detalle_Pedido.bulkCreate(detallesPedido);

        res.status(201).json({ message: 'Pedido creado con éxito', pedido });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
};




module.exports = {
    validateProducto
}