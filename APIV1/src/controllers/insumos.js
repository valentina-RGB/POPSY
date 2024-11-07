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
      estado_insumo, // Opcional: Puedes incluir este campo si es necesario
      precio,
      stock_min,
      stock_max,
      stock_actual,
      medida,
      unidad
    } = req.body;

    // Verificar si el insumo ya existe
    const insumoExistente = await Insumos.findOne({ 
      where: { descripcion_insumo } 
    });

    if (insumoExistente) {
      await transaction.rollback(); // Revertir la transacción si hay un duplicado
      return res.status(400).json({ message: 'El insumo ya existe con la misma descripción.' });
    }

    const insumo = await Insumos.create({
      ID_tipo_insumo,
      descripcion_insumo,
      estado_insumo, 
      precio
    }, { transaction });
  
    await StockInsumos.create({
      stock_min: stock_min || 0,
      stock_max: stock_max || 100,
      stock_actual: stock_actual || 0,
      ID_insumo: insumo.ID_insumo,
      medida: medida || 'unidad',
      unidad: unidad || 0
    }, { transaction });

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
    stock_min,
    stock_max,
    medida,
    unidad,
    stock_actual
  } = req.body;




  try {
    // Verificar si el insumo existe
    const insumoExistente = await Insumos.findByPk(id);
    if (!insumoExistente) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    // Verificar si se está intentando actualizar la descripción del insumo a una ya existente
    if (descripcion_insumo) {
      const insumoDuplicado = await Insumos.findOne({
        where: {
          descripcion_insumo,
          ID_insumo: { [db.Sequelize.Op.ne]: id } // Excluir el insumo actual
        }
      });

      if (insumoDuplicado) {
        return res.status(400).json({ message: 'Ya existe otro insumo con la misma descripción.' });
      }
    }

    // Actualizar el insumo
    const [updated] = await Insumos.update(
      {
        descripcion_insumo,
        estado_insumo,
        ID_tipo_insumo,
        precio
      },
      { where: { ID_insumo: id } }
    );

    if (updated) {
      // Actualizar los datos del stock si se han recibido en el cuerpo de la solicitud
      if (stock_min !== undefined || stock_max !== undefined || medida !== undefined || unidad !== undefined || stock_actual !== undefined) {
        await StockInsumos.update(
          {
            stock_min: stock_min !== undefined ? stock_min : insumoExistente.stock_min,
            stock_max: stock_max !== undefined ? stock_max : insumoExistente.stock_max,
            medida: medida !== undefined ? medida : insumoExistente.medida,
            unidad: unidad !== undefined ? unidad : insumoExistente.unidad,
            stock_actual: stock_actual !== undefined ? stock_actual : insumoExistente.stock_actual
          },
          { where: { ID_insumo: id } }
        );
      }

      // Obtener el insumo actualizado con los datos del stock
      const updatedInsumo = await Insumos.findOne({
        where: { ID_insumo: id },
        include: [{ model: StockInsumos, as: 'stock' }]
      });

      res.status(200).json(updatedInsumo);
    } else {
      res.status(404).json({ message: 'No se pudo actualizar el insumo.' });
    }
  } catch (error) {
    console.error('Error al actualizar el insumo:', error);
    res.status(500).json({ message: 'Ocurrió un error al actualizar el insumo.' });
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
