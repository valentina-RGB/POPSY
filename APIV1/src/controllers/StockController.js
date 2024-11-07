// controllers/StockInsumosController.js
const db = require('../../models');

const StockInsumos = db.StockInsumos;
const HistorialStock = db.HistorialStock;

const obtenerStockInsumos = async (req, res) => {
  try {
    const stockInsumos = await StockInsumos.findAll();
    res.status(200).json(stockInsumos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerStockInsumoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const stockInsumo = await StockInsumos.findByPk(id);
    if (stockInsumo) {
      res.status(200).json(stockInsumo);
    } else {
      res.status(404).json({ message: 'Stock de insumo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const agregarStock = async (req, res) => {
  const { id } = req.params; 
  const { cantidad, descripcion } = req.body;

  try {
    const stockInsumo = await StockInsumos.findOne({ where: { ID_insumo: id } });

    if (!stockInsumo) {
      return res.status(404).json({ message: 'Stock de insumo no encontrado' });
    }

    // Actualizar stock actual
    stockInsumo.stock_actual += cantidad;
    await stockInsumo.save();

    // Registrar la entrada en el historial
    await HistorialStock.create({
      ID_insumo: id,
      cantidad,
      descripcion,
      fecha: new Date(),
    });

    res.status(201).json({ message: 'Stock actualizado y entrada registrada en el historial' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const eliminarStockInsumo = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await StockInsumos.destroy({
      where: { ID_stock_insumo: id },
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: 'Stock de insumo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  obtenerStockInsumos,
  obtenerStockInsumoPorId,
  agregarStock,
  eliminarStockInsumo,
};
