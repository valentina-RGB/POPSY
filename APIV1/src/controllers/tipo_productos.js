const express = require("express");
const service = require("../services/tipo_productServices");

const obtener_tipo = async (req, res) => {
  try {
    const tiposProductos = await service.Listar_tipo();
    if (!tiposProductos) {
      return res.status(404).json({ message: "El tipo del producto no se encontró" });
    }
    return res.status(200).json(tiposProductos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const obtener_tipo_ID = async (req, res) => {
  const { id } = req.params;
  try {
    const tipo = await service.Listar_tipo_ID(id);
    if (!tipo) {
      return res.status(404).json({ message: "El tipo del producto no se encontró" });
    }
    return res.status(200).json(tipo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const CrearTipo = async (req, res) => {
  const { ID_tipo_productos, descripcion } = req.body;

  const data = {
    ID_tipo_productos,
    descripcion,
  };

  try {
    const nuevo = await service.Agregar_tipo(data);
    if (!nuevo) {
      return res.status(404).json({ message: "No se pudo crear el tipo de producto" });
    }
    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const ActualizarTipo = async (req, res) => {
  const { id } = req.params;
  try {
    const updated= await service.Actualizar_tipo(id, req.body);
    if (updated) {
      return res.status(200).json({ message: "Tipo de producto actualizado correctamente",updated });
    } else {
      return res.status(404).json({ message: "El tipo del producto no se encontró" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const EliminarTipo = async (req, res) => {
  const { id } = req.params;
  try {
    const eliminado = await service.Eliminar_tipo(id);
    if (eliminado) {
      return res.status(204).json({ message: "Tipo de producto eliminado" });
    } else {
      return res.status(404).json({ message: "El tipo del producto no se encontró" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  obtener_tipo,
  obtener_tipo_ID,
  CrearTipo,
  ActualizarTipo,
  EliminarTipo,
};
