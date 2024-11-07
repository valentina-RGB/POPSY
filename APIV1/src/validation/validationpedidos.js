const Joi = require('joi');
const { Pedido, Detalle_Pedido } = require('./models');

const pedidoSchema = Joi.object({
    ID_usuario: Joi.number().integer().positive().required(),
    productos: Joi.array().items(
        Joi.object({
            ID_producto: Joi.number().integer().positive().required(),
            cantidad: Joi.number().integer().positive().required(),
            precio_neto: Joi.number().positive().required()
        })
    ).required()
});

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


module.exports = {crearPedido}