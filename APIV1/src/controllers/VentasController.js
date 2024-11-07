const { Ventas, Clientes, Productos, Producto_Ventas, Estado_ventas } = require('../../models');

// Crear una nueva venta
const createVenta = async (req, res) => {
    try {
        const { ID_cliente, productos, precio_total, ID_estado_venta } = req.body;

        // Verificar si el estado de venta existe
        if (ID_estado_venta) {
            const estadoVenta = await Estado_ventas.findByPk(ID_estado_venta);
            if (!estadoVenta) {
                return res.status(400).json({ error: 'Estado de venta no encontrado' });
            }
        }

        // Crear la venta
        const nuevaVenta = await Ventas.create({
            ID_cliente,
            precio_total,
            ID_estado_venta
        });

        // Asociar productos a la venta
        for (const producto of productos) {
            await Producto_Ventas.create({
                ID_producto: producto.ID_producto,
                ID_venta: nuevaVenta.ID_venta,
                cantidad: producto.cantidad,
                precio: producto.precio
            });
        }

        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las ventas
const getAllVentas = async (req, res) => {
    try {
        const ventas = await Ventas.findAll({
            include: [
                { model: Clientes, as: 'Cliente', attributes: ['nombre'] }, // Incluye el campo nombre
                { model: Productos, as: 'Productos', through: { attributes: ['cantidad', 'precio'] } },
                { model: Estado_ventas, as: 'Estado_venta' }
            ]
        });

        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Ventas.findByPk(id, {
            include: [
                { model: Clientes, as: 'Cliente', attributes: ['nombre'] }, // Incluye el campo nombre
                { model: Productos, as: 'Productos', through: { attributes: ['cantidad', 'precio'] } },
                { model: Estado_ventas }
            ]
        });

        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateEstadoVenta = async (req, res) => {
    try {
        console.log('Update Estado Venta called');
        const { id } = req.params;
        const { ID_estado_venta } = req.body;

        // Verificar si el estado de venta existe
        const estadoVenta = await Estado_ventas.findByPk(ID_estado_venta);
        if (!estadoVenta) {
            return res.status(400).json({ menssage: 'Estado de venta no encontrado' });
        }

        // Verificar si la venta existe
        const venta = await Ventas.findByPk(id);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Actualizar el estado de la venta
        venta.ID_estado_venta = ID_estado_venta;
        await venta.save();

        res.status(200).json(venta);
    } catch (error) {
        console.error(error); // Agrega esta línea para ver errores en los logs
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una venta
const deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Ventas.findByPk(id);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Eliminar la venta y sus asociaciones
        await Producto_Ventas.destroy({ where: { ID_venta: id } });
        await venta.destroy();

        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createVenta,
    getAllVentas,
    getVentaById,
    updateEstadoVenta,
    deleteVenta
    
};
