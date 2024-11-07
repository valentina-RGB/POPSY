const db = require('../../models');

// Asegúrate de que el nombre del modelo coincida con el exportado en tu archivo de modelo
const Estado_ventas = db.Estado_ventas;

const obtenerEstadoVentas = async (req, res) => {
    try {
        const estadosVenta = await Estado_ventas.findAll();
        res.status(200).json(estadosVenta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const obtenerEstadoVentasPorid = async (req, res) => {
    const { id } = req.params;
    try {
        const estadoVenta = await Estado_ventas.findByPk(id);
        if (!estadoVenta) {
            return res.status(404).json({ message: 'Estado de venta no encontrado' });
        }
        res.status(200).json(estadoVenta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const CrearEstadoVenta = async (req, res) => {
    try {
        const nuevoEstadoVenta = await Estado_ventas.create(req.body);
        res.status(201).json(nuevoEstadoVenta);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const actualizarEstadoVenta = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Estado_ventas.update(req.body, {
            where: { ID_estado_venta: id }
        });
        if (updated) {
            const estadoVentaActualizado = await Estado_ventas.findByPk(id);
            return res.status(200).json(estadoVentaActualizado);
        }
        throw new Error('Estado de venta no encontrado');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const eliminarEstadoVenta = async (req, res) => {
    const { id } = req.params;
    try {
        const eliminado = await Estado_ventas.destroy({
            where: { ID_estado_venta: id }
        });
        if (eliminado) {
            return res.status(204).json({ message: 'Estado de venta eliminado' });
        }
        throw new Error('Estado de venta no encontrado');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    obtenerEstadoVentas,
    obtenerEstadoVentasPorid,
    CrearEstadoVenta,
    actualizarEstadoVenta,
    eliminarEstadoVenta
};
