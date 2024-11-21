const express = require("express");
const service = require("../services/Producto_insumosServices");

const obtener_detalle = async (req, res) => {
  try {
    const respuesta = await service.ListarPI();
    if (!respuesta) {
      return res.status(404).json({ message: "El detalle no se encontró" });
    }
    return res.status(200).json(respuesta);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const obtener_detalleID = async (req, res) => {
  const { id } = req.params;
  try {
    const respuesta = await service.ListarPI_ID(id);
    if (!respuesta) {
      return res.status(404).json({ message: "El detalle no se encontró" });
    }
    return res.status(200).json(respuesta);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const CrearDetalle = async (req, res) => {
  const { ID_productos_tipo, ID_insumos_tipo, cantidad, configuracion } = req.body;

  try {
    const nuevo = await service.AgregarPI(ID_insumos_tipo,ID_productos_tipo,cantidad,configuracion);
    if (!nuevo) {
      return res.status(404).json({ message: "No se pudo crear el detalle" });
    }
    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const ActualizarDetalle= async (req, res) => {
  const { id } = req.params;
  try {
    const updated= await service.ActualizarPI(id, req.body);
    if (updated) {
      return res.status(200).json({ message: "Tipo de producto actualizado correctamente",updated });
    } else {
      return res.status(404).json({ message: "El tipo del producto no se encontró" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const EliminarDetalle = async (req, res) => {
  const { id } = req.params;
  try {
    const eliminado = await service.EliminarPI(id);
    if (eliminado) {
      return res.status(204).json({ message: "Detalle eliminado" });
    } else {
      return res.status(404).json({ message: "El detalle no se encontró" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
obtener_detalle,
obtener_detalleID,
CrearDetalle,
ActualizarDetalle,
EliminarDetalle
};
