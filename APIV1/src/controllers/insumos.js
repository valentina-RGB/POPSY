// controllers/InsumosController.js
const { sequelize } = require('../../models'); 
const db = require('../../models');
const { validateInsumos, validateUpdateInsumo } = require('../validation/validations_ISE');
const { request, response } = require("express");

const Insumos = db.Insumos;
const StockInsumos = db.StockInsumos;
const HistorialEntradas = db.HistorialEntradas

const obtenerInsumos = async (req = request, res) => {
  const { ID_tipo_insumo } = req.query;
  try {
    let whereClause = {};

    if (ID_tipo_insumo) {
      whereClause.ID_tipo_insumo = ID_tipo_insumo;
    }

    const insumos = await Insumos.findAll({
      where: whereClause,
      include: [
        {
          model: StockInsumos,
          as: 'stock',
          attributes: ['stock_actual', 'stock_min', 'stock_max'], // Incluye otros atributos si es necesario
          required: false // Permite que se incluyan insumos sin stock
        }
      ]
    });

    console.log(JSON.stringify(insumos, null, 2));
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerInsumoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const insumo = await Insumos.findByPk(id);
    if (insumo) {
      res.status(200).json(insumo);
    } else {
      res.status(404).json({ message: 'Insumo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const crearInsumo = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      ID_tipo_insumo,
      descripcion_insumo,
      estado_insumo,
      precio,
      stock, // Recibimos el objeto stock
    } = req.body;

    // Verificar si el insumo ya existe
    const insumoExistente = await Insumos.findOne({
      where: { descripcion_insumo },
    });

    if (insumoExistente) {
      await transaction.rollback(); // Revertir la transacción si hay un duplicado
      return res
        .status(400)
        .json({ message: 'El insumo ya existe con la misma descripción.' });
    }

    const insumo = await Insumos.create(
      {
        ID_tipo_insumo,
        descripcion_insumo,
        estado_insumo,
        precio,
      },
      { transaction }
    );

    if (stock) {
      const { stock_min = 0, stock_max = 100, stock_actual = 0 } = stock;

      await StockInsumos.create(
        {
          stock_min,
          stock_max,
          stock_actual,
          ID_insumo: insumo.ID_insumo,
          medida: 'unidad', // Puedes modificar si se incluye en stock
          unidad: 0,
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).json(insumo);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
};


const actualizarInsumo = async (req, res) => {
  const { id } = req.params;
  const {
    descripcion_insumo,
    estado_insumo,
    ID_tipo_insumo,
    precio,
    stock, // Recibimos el objeto stock para actualizarlo
  } = req.body;

  const transaction = await db.sequelize.transaction();
  
  try {
    // Buscar el insumo a actualizar
    const insumo = await Insumos.findByPk(id);

    if (!insumo) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    // Actualizar los campos principales del insumo
    if (descripcion_insumo) insumo.descripcion_insumo = descripcion_insumo;
    if (estado_insumo) insumo.estado_insumo = estado_insumo;
    if (ID_tipo_insumo) insumo.ID_tipo_insumo = ID_tipo_insumo;
    if (precio) insumo.precio = precio;

    // Guardar cambios en la tabla Insumos
    await insumo.save({ transaction });

    // Si se proporciona el objeto stock, actualizar StockInsumos
    if (stock) {
      const { stock_min, stock_max, stock_actual } = stock;

      const stockInsumo = await StockInsumos.findOne({
        where: { ID_insumo: insumo.ID_insumo },
      });

      if (!stockInsumo) {
        // Si no existe el registro de StockInsumos, se crea uno nuevo
        await StockInsumos.create(
          {
            stock_min: stock_min || 0,
            stock_max: stock_max || 100,
            stock_actual: stock_actual || 0,
            ID_insumo: insumo.ID_insumo,
            medida: medida || 'unidad', // Por defecto 'unidad'
            unidad: unidad || 0, // Valor predeterminado de unidad
          },
          { transaction }
        );
      } else {
        // Si existe el registro, se actualizan los valores
        if (stock_min !== undefined) stockInsumo.stock_min = stock_min;
        if (stock_max !== undefined) stockInsumo.stock_max = stock_max;
        if (stock_actual !== undefined) stockInsumo.stock_actual = stock_actual;
        if (medida !== undefined) stockInsumo.medida = medida;
        if (unidad !== undefined) stockInsumo.unidad = unidad;

        await stockInsumo.save({ transaction });
      }
    }

    // Confirmar la transacción
    await transaction.commit();

    // Responder con el insumo actualizado
    res.status(200).json(insumo);
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
};




const eliminarInsumo = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Insumos.destroy({
      where: { ID_insumo: id },
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: 'Insumo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const agregarEntrada = async (req, res) => {
  const { id } = req.params;
  try {
    const insumo = await Insumos.findByPk(id);
    if (!insumo) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    const { cantidad, descripcion } = req.body;

    // Registrar la entrada en el historial de entradas
    await HistorialEntradas.create({
      ID_insumo: id,
      cantidad,
      descripcion,
      fecha: new Date(),
    });

    // Actualizar el stock_actual en Stock_insumos
    await StockInsumos.increment('stock_actual', { by: cantidad, where: { ID_insumo: id } });

    res.status(201).json({ message: 'Entrada registrada y stock actualizado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getInsumoDetails = async (req, res) => {
  try {
      const { id } = req.params;
      const insumo = await Insumos.findOne({
          where: { ID_insumo: id },
          include: [
              { model: StockInsumos, as: 'stock' }
          ]
      });

      if (!insumo) {
          return res.status(404).json({ error: 'Insumo no encontrado' });
      }

      res.json(insumo);
  } catch (error) {
      console.error('Error al obtener el detalle del insumo:', error);
      res.status(500).json({ error: 'Error al obtener el detalle del insumo' });
  }
};




module.exports = {
  obtenerInsumos,
  obtenerInsumoPorId,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo,
  agregarEntrada,
  getInsumoDetails
};
