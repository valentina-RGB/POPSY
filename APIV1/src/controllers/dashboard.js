const { Producto_Ventas, Productos, Ventas, Estado_ventas, sequelize, Sequelize } = require('../../models');
const { Op } = require('sequelize');

const obtenerProductosMasVendidos = async (req, res) => {
    try {
        const productosMasVendidos = await Producto_Ventas.findAll({
            attributes: [
                'ID_producto',
                [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_vendido'],
            ],
            include: [
                {
                    model: Productos,
                    as: 'Producto',
                    attributes: ['nombre'],
                },
            ],
            group: ['ID_producto', 'Producto.ID_producto'],
            order: [[sequelize.literal('total_vendido'), 'DESC']],
            limit: 5,
        });

        res.status(200).json(productosMasVendidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos más vendidos' });
    }
};

const obtenerVentas = async (req, res) => {
    try {
        const { filtro, fecha } = req.query; // filtro puede ser "mes", "dias", "rango", "año"
        const estadoVenta = 1;

        let fechaInicio, fechaFin;
        const ahora = new Date();

        switch (filtro) {
            case 'mes':
                // Si se proporciona una fecha, usamos ese mes y año, si no, el mes actual
                if (fecha) {
                    const fechaObj = new Date(fecha);
                    fechaInicio = new Date(fechaObj.getFullYear(), fechaObj.getMonth(), 1);
                    fechaFin = new Date(fechaObj.getFullYear(), fechaObj.getMonth() + 1, 0, 23, 59, 59);
                } else {
                    fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
                    fechaFin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);
                }
                break;

            case 'dias':
                // Si se proporciona un número específico de días, lo usamos, por defecto 7
                const numeroDias = fecha ? parseInt(fecha) : 7;
                fechaFin = new Date(ahora.setHours(23, 59, 59, 999));
                fechaInicio = new Date(ahora);
                fechaInicio.setDate(fechaInicio.getDate() - numeroDias);
                fechaInicio.setHours(0, 0, 0, 0);
                break;

            case 'rango':
                // Esperamos fecha en formato "YYYY-MM-DD,YYYY-MM-DD"
                if (!fecha) {
                    return res.status(400).json({
                        error: 'Para el filtro por rango, proporcione las fechas en formato "YYYY-MM-DD,YYYY-MM-DD"'
                    });
                }
                const [inicio, fin] = fecha.split(',');
                fechaInicio = new Date(inicio);
                fechaInicio.setHours(0, 0, 0, 0);
                fechaFin = new Date(fin);
                fechaFin.setHours(23, 59, 59, 999);
                break;

            case 'año':
                // Si se proporciona un año específico, lo usamos, si no, el año actual
                const año = fecha ? parseInt(fecha) : ahora.getFullYear();
                fechaInicio = new Date(año, 0, 1);
                fechaFin = new Date(año, 11, 31, 23, 59, 59);
                break;

            default:
                return res.status(400).json({
                    error: 'Filtro no válido. Use "mes", "dias", "rango" o "año".',
                    ejemplos: {
                        mes: '?filtro=mes&fecha=2024-03', // Mes específico
                        dias: '?filtro=dias&fecha=15', // Últimos 15 días
                        rango: '?filtro=rango&fecha=2024-03-01,2024-03-31', // Rango específico
                        año: '?filtro=año&fecha=2024' // Año específico
                    }
                });
        }

        // Validación adicional de fechas
        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            return res.status(400).json({ error: 'Fechas proporcionadas no válidas' });
        }

        // Consulta a la base de datos
        const ventas = await Ventas.findAll({
            where: {
                ID_estado_venta: estadoVenta,
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
            },
            attributes: [
                'ID_venta',
                'fecha',
                'precio_total',
                [
                    Sequelize.fn('DATE', Sequelize.col('fecha')),
                    'fecha_sin_hora'
                ]
            ],
            include: [
                {
                    model: Estado_ventas,
                    as: 'Estado',
                    attributes: ['descripcion'],
                },
            ],
            order: [['fecha', 'ASC']],
        });

        if (!ventas || ventas.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron ventas en el rango de fechas especificado.',
                rango: {
                    desde: fechaInicio.toISOString().split('T')[0],
                    hasta: fechaFin.toISOString().split('T')[0]
                }
            });
        }

        // Calcular estadísticas
        const estadisticas = {
            totalVentas: ventas.reduce((acc, venta) => acc + venta.precio_total, 0),
            cantidadVentas: ventas.length,
            promedioVentaDiaria: ventas.reduce((acc, venta) => acc + venta.precio_total, 0) /
                (Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))),
            ventasPorDia: ventas.reduce((acc, venta) => {
                const fecha = venta.getDataValue('fecha_sin_hora');
                acc[fecha] = (acc[fecha] || 0) + venta.precio_total;
                return acc;
            }, {}),
            // Nuevo cálculo: cantidad de ventas por día
            cantidadVentasPorDia: ventas.reduce((acc, venta) => {
                const fecha = venta.getDataValue('fecha_sin_hora');
                acc[fecha] = (acc[fecha] || 0) + 1; 
                return acc;
            }, {})
        };

        res.json({
            metadata: {
                filtro,
                periodo: {
                    inicio: fechaInicio.toISOString(),
                    fin: fechaFin.toISOString()
                }
            },
            datos: {
                ventas,
                estadisticas
            }
        });

    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        res.status(500).json({
            error: 'Error del servidor al procesar la consulta de ventas.',
            detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    obtenerProductosMasVendidos,
    obtenerVentas,
};
