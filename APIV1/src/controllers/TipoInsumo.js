// controllers/tipoInsumo.js
const db = require('../../models');

const TipoInsumo = db.Tipo_insumos;


const obtenerTiposInsumos = async (req, res) => {
    try {
      const tiposInsumos = await TipoInsumo.findAll();
      res.status(200).json(tiposInsumos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const obtenerTipoInsumoPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const tipoInsumo = await TipoInsumo.findByPk(id);
      if (!tipoInsumo) {
        return res.status(404).json({ message: 'Tipo de insumo no encontrado' });
      }
      res.status(200).json(tipoInsumo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const crearTipoInsumo = async (req, res) => {
    try {
      const nuevoTipoInsumo = await TipoInsumo.create(req.body);
      res.status(201).json(nuevoTipoInsumo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const actualizarTipoInsumo = async (req, res) => {
    const { id } = req.params;
    try {
      const [updated] = await TipoInsumo.update(req.body, {
        where: { ID_tipo_insumo: id }
      });
      if (updated) {
        const tipoInsumoActualizado = await TipoInsumo.findByPk(id);
        return res.status(200).json(tipoInsumoActualizado);
      }
      throw new Error('Tipo de insumo no encontrado');
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const eliminarTipoInsumo = async (req, res) => {
    const { id } = req.params;
    try {
      const eliminado = await TipoInsumo.destroy({
        where: { ID_tipo_insumo: id }
      });
      if (eliminado) {
        return res.status(204).json({ message: 'Tipo de insumo eliminado' });
      }
      throw new Error('Tipo de insumo no encontrado');
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = {
    obtenerTiposInsumos,
    obtenerTipoInsumoPorId,
    crearTipoInsumo,
    actualizarTipoInsumo,
    eliminarTipoInsumo,
  };