const { HistorialEntradas, Insumos, StockInsumos  } = require('../../models');

// Obtener todas las entradas del historial
const getAllEntradas = async (req, res) => {
  try {
    const entradas = await HistorialEntradas.findAll({
      include: [{ model: Insumos, attributes: ['descripcion_insumo'] }]
    });
    res.status(200).json(entradas);
  } catch (error) {
    console.error('Error al obtener el historial de entradas:', error);
    res.status(500).json({ error: 'Error al obtener el historial de entradas' });
  }
};

// Obtener una entrada por ID
const getEntradaById = async (req, res) => {
  const { id } = req.params;
  try {
    const entrada = await HistorialEntradas.findByPk(id, {
      include: [{ model: Insumos, attributes: ['descripcion_insumo'] }]
    });
    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }
    res.status(200).json(entrada);
  } catch (error) {
    console.error('Error al obtener la entrada:', error);
    res.status(500).json({ error: 'Error al obtener la entrada' });
  }
};

// Crear o registrar una nueva entrada en el historial
const createEntrada = async (req, res) => {
  const { ID_insumo, cantidad, fecha } = req.body;
  try {
    const nuevaEntrada = await HistorialEntradas.create({ ID_insumo, cantidad, fecha });
    res.status(201).json(nuevaEntrada);
  } catch (error) {
    console.error('Error al crear la entrada:', error);
    res.status(500).json({ error: 'Error al crear la entrada' });
  }
};

// Editar una entrada por ID
const updateEntrada = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  try {
    // Encuentra la entrada a actualizar
    const entrada = await HistorialEntradas.findByPk(id);

    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    // Encuentra el stock del insumo relacionado
    const stockInsumo = await StockInsumos.findOne({ where: { ID_insumo: entrada.ID_insumo } });

    if (!stockInsumo) {
      return res.status(404).json({ error: 'Stock del insumo no encontrado' });
    }

    // Calcula la diferencia entre la nueva cantidad y la cantidad anterior
    const diferenciaCantidad = cantidad - entrada.cantidad;

    // Actualiza el stock actual basado en la diferencia
    stockInsumo.stock_actual = stockInsumo.stock_actual + diferenciaCantidad;

    // Verifica que el stock no sea negativo
    if (stockInsumo.stock_actual < 0) {
      return res.status(400).json({ error: 'El stock del insumo no puede ser negativo' });
    }

    // Guarda los cambios en el stock
    await stockInsumo.save();

    // Actualiza la cantidad en el historial de entradas
    entrada.cantidad = cantidad;
    await entrada.save();

    res.json({ message: 'Entrada actualizada exitosamente', entrada });
  } catch (error) {
    console.error('Error al actualizar la entrada:', error);
    res.status(500).json({ error: 'Error al actualizar la entrada' });
  }
};

// Eliminar una entrada por ID
const deleteEntrada = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Encuentra la entrada a eliminar
    const entrada = await HistorialEntradas.findByPk(id);
    
    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    // Encuentra el stock del insumo relacionado
    const stockInsumo = await StockInsumos.findOne({ where: { ID_insumo: entrada.ID_insumo } });

    if (!stockInsumo) {
      return res.status(404).json({ error: 'Stock del insumo no encontrado' });
    }

    // Actualiza el stock actual
    stockInsumo.stock_actual = stockInsumo.stock_actual - entrada.cantidad;

    // Verifica que el stock no sea negativo
    if (stockInsumo.stock_actual < 0) {
      return res.status(400).json({ error: 'El stock del insumo no puede ser negativo' });
    }

    await stockInsumo.save(); // Guarda los cambios en el stock

    // Elimina la entrada
    await entrada.destroy();

    res.status(204).json();
  } catch (error) {
    console.error('Error al eliminar la entrada:', error);
    res.status(500).json({ error: 'Error al eliminar la entrada' });
  }
};


module.exports = {
  getAllEntradas,
  getEntradaById,
  createEntrada,
  updateEntrada,
  deleteEntrada,
};
