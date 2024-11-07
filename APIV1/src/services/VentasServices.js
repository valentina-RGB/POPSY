const { Ventas, Producto_Ventas, Productos, Clientes, Estado_ventas } = require('../../models');

const getVentas = async (res, req) => {
  try {
    const ventas = await Ventas.findAll({
      include: [
        { model: Clientes, attributes: ['nombre', 'email'] },
        { model: Estado_ventas, attributes: ['descripcion'] },
        { 
          model: Productos, 
          as: 'Productos',
          through: { attributes: ['cantidad', 'precio'] }
        }
      ]
    });
    res.status(200).json(ventas);
  } catch (error) {
    throw error;
  }
};

const getVentaById = async (id) => {
  try {
    const venta = await Ventas.findByPk(id, {
      include: [
        { model: Clientes, attributes: ['nombre', 'email'] },
        { model: Estado_ventas, attributes: ['descripcion'] },
        { 
          model: Productos, 
          as: 'Productos',
          through: { attributes: ['cantidad', 'precio'] }
        }
      ]
    });
    return venta;
  } catch (error) {
    throw error;
  }
};

const createVenta = async (req, res) => {
  try {
    const { ID_cliente, precio_total, ID_estado_venta, ProductosLista } = req.body;
    const venta = await Ventas.create({ ID_cliente, precio_total, ID_estado_venta });

    if (ProductosLista && ProductosLista.length > 0) {
      const productos = ProductosLista.map(prod => ({
        ID_producto: prod.ID_producto,
        cantidad: prod.cantidad,
        precio: prod.precio_neto
      }));
      await venta.addProductos(productos);
    }

    res.status(201).json(venta);
  } catch (error) {
    throw error;
  }
};

const updateVenta = async (id, body) => {
  try {
    const venta = await Ventas.findByPk(id);
    if (!venta) {
      throw { status: 404, message: 'Venta no encontrada' };
    }

    await venta.update(body);
    return venta;
  } catch (error) {
    throw error;
  }
};

const deleteVenta = async (id) => {
  try {
    const venta = await Ventas.findByPk(id);
    if (!venta) {
      throw { status: 404, message: 'Venta no encontrada' };
    }

    await venta.destroy();
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta
};
