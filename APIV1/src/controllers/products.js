const express = require("express");
const { request, response } = require("express");
const ProductosService = require("../services/productsServices");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Producto_insumos } = require("../../models");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ruta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const obtenerProductos = async (req, res) => {
  //  const {nombre,ID_tipo_productos} = req.query;
   
    try {
      return await ProductosService.getProductos(res,req);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  obtenerProductosPorId = async (req, res) => {
    try {
      const { id } = req.params;

      const productos = await ProductosService.getProductosID(id);

      if (productos) {
        res.status(200).json(productos);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  CrearProductos = async (req = request, res = response) => {
    const {
      ID_tipo_productos,
      Insumos,
      precio,
      cantidad,
      nombre,
      descripcion,
      precio_neto,
      estado_productos,
      ID_categorias,
      
    } = req.body;

    let imagen = null;

    // Si hay un archivo, obtener la ruta del archivo
    if (req.file) {
      imagen = `/imagenes/${req.file.filename}`; // Ruta de la imagen
    }

    try {
      const productos = await ProductosService.CreateProdutos(
        ID_tipo_productos,
        Insumos,
        precio,
        cantidad,
        nombre,
        descripcion,
        precio_neto,
        estado_productos,
        ID_categorias,
        imagen
      );

      if (productos) {
        res.json(productos);
      }
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  },
  ModificarProductos = async (req = request, res = response) => {
    const { id } = req.params;
    const {
      ID_tipo_productos,
      Insumos,
      nombre,
      descripcion,
      precio_neto,
      estado_productos,
      ID_categorias,
    } = req.body;

    let imagen = null;

    try {
      // Obtener el producto existente
      const ProductoExistente = await ProductosService.getProductosID(id);

      if (!ProductoExistente) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Manejar la imagen
      if (req.file) {
        imagen = `/imagenes/${req.file.filename}`; // Ruta de la nueva imagen

        // Eliminar la imagen antigua si existe
        if (ProductoExistente.imagen) {
          const imagenPath = path.join(
            __dirname,
            "../../uploads",
            path.basename(ProductoExistente.imagen)
          );
          if (fs.existsSync(imagenPath)) {
            fs.unlinkSync(imagenPath); // Eliminar el archivo del sistema
          }
        }
      } else {
        imagen = ProductoExistente.imagen;
      }

      // Preparar los datos para la actualización
      const data = {
        nombre: nombre || ProductoExistente.nombre,
        descripcion: descripcion || ProductoExistente.descripcion,
        precio_neto: precio_neto || ProductoExistente.precio_neto,
        estado_productos:
        estado_productos || ProductoExistente.estado_productos,
        ID_tipo_productos:
          ID_tipo_productos || ProductoExistente.ID_tipo_productos,
        ID_categorias: ID_categorias || ProductoExistente.ID_categorias,
        imagen: imagen || "N/A",
      };

      // Actualizar el producto
      const updatecategories = await ProductosService.PatchProductos(id, data);
// Obtener los insumos actuales asociados al producto
const insumosActuales = await Producto_insumos.findAll({
  where: {
    ID_productos_tipo: id,
  },
});

// Convertir los insumos actuales en un arreglo de IDs para comparación
const idsInsumosActuales = insumosActuales.map(
  (productoInsumo) => productoInsumo.ID_insumos_tipo
);

// Obtener los IDs de los insumos enviados desde el frontend
const idsInsumosNuevos = Array.isArray(Insumos)
  ? Insumos.map((insumo) => insumo.ID_insumo)
  : [];

// Identificar los insumos que fueron eliminados (están en la BD pero no en el request)
const insumosEliminados = idsInsumosActuales.filter(
  (idInsumo) => !idsInsumosNuevos.includes(idInsumo)
);

// Eliminar los insumos que no están en la nueva lista
if (insumosEliminados.length > 0) {
  await Producto_insumos.destroy({
    where: {
      ID_productos_tipo: id,
      ID_insumos_tipo: insumosEliminados,
    },
  });
}

// Actualizar los insumos si existen o agregar los nuevos
if (Array.isArray(Insumos)) {
  for (const insumo of Insumos) {
    if (insumo && insumo.Producto_insumos) {
      // Verificar si el insumo ya existe en la relación Producto_insumos
      const productoInsumo = await Producto_insumos.findOne({
        where: {
          ID_insumos_tipo: insumo.ID_insumo,
          ID_productos_tipo: id,
        },
      });

      if (productoInsumo) {
        // Actualizar el insumo existente
        await productoInsumo.update({
          cantidad:
            insumo.Producto_insumos.cantidad || productoInsumo.cantidad,
          configuracion:
            insumo.Producto_insumos.configuracion ||
            productoInsumo.configuracion,
          precio:
            (insumo.precio || productoInsumo.precio) *
            (insumo.Producto_insumos.cantidad || productoInsumo.cantidad),
        });
      } else {
        // Si el insumo no existe, lo creamos
        await Producto_insumos.create({
          ID_productos_tipo: id,
          ID_insumos_tipo: insumo.ID_insumo,
          cantidad: insumo.Producto_insumos.cantidad,
          configuracion: insumo.Producto_insumos.configuracion,
          precio: insumo.precio * insumo.Producto_insumos.cantidad,
        });
      }
    } else {
      console.error(
        "Insumo o propiedades de insumo no están definidos:",
        insumo
      );
    }
  }
}


      res.status(200).json({
        message: "Producto actualizado exitosamente",
        updatecategories,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  EliminarProductos = async (req = request, res = response) => {
    const { id } = req.params;
    try {
      // Buscar la categoría para obtener la imagen
      const producto = await ProductosService.getProductosID(id); // Asegúrate de tener este método implementado

      // Si la categoría tiene una imagen
      if (producto && producto.imagen) {
        // Construir la ruta absoluta de la imagen
        const imagePath = path.join(
          __dirname,
          "../../uploads",
          path.basename(producto.imagen)
        ); // Ajusta la ruta a donde guardas las imágenes

        // Verificar si la imagen existe
        if (fs.existsSync(imagePath)) {
          // Eliminar la imagen
          fs.unlinkSync(imagePath);
        }
      }
      const dato = await ProductosService.DeleteProductos(id);
      res.status(204).json({ message: "El dato fue eliminado", dato });
    } catch (error) {
      const statusCode = error.status || 500;
      res
        .status(statusCode)
        .json({ error: error.message || "Internal Server Error" });
    }
  };

module.exports = {
  obtenerProductos,
  obtenerProductosPorId,
  CrearProductos,
  ModificarProductos,
  EliminarProductos,
  upload,
};
