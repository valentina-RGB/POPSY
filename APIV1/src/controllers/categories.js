const express = require('express');
const {request , response} = require('express');
const categorieService = require('../services/categoriesServices');
const multer = require('multer');
const  path  = require('path');
const fs= require('fs'); 



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Ruta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const 
    obtenercategorias = async (req, res) => {
        try{

        return await categorieService.getCategorie(res,req);  
       
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    obtenerCategoriasPorId = async (req, res) => {
        try {
            const {id} = req.params;
            const categorias = await categorieService.getCategoriesID(id);

      if (categorias) {
        res.status(200).json(categorias);
      } else {
        res.status(404).json({ message: "Categorias not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const CrearCategorias = async (req = request, res = response) => {
  try {
  
    const { estado, descripcion} = req.body;
    let imagen = null;

    // Si hay un archivo, obtener la ruta del archivo
    if (req.file) {
      imagen = `/imagenes/${req.file.filename}`; // Ruta de la imagen
    }

    const data = {
       descripcion,
       estado,
       imagen: imagen||'',
    };

    const categorias = await categorieService.CreateCategories(data);
    res
      .status(201)
      .json({ message: "Categorie created successfully", categorias });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



  const ModificarCategorias = async (req = request, res = response) => {
    const { id } = req.params;
    const { descripcion, estado_categoria } = req.body;
    let imagen = null;
  
    try {
      // Obtener la categoría actual para acceder a la imagen existente
      const categoriaExistente = await categorieService.getCategoriesID(id);
  
      if (!categoriaExistente) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
  
      // Si hay un archivo, obtener la ruta del archivo
      if (req.file) {
        imagen = `/imagenes/${req.file.filename}`; // Ruta de la nueva imagen
  
        // Eliminar la imagen antigua si existe
        if (categoriaExistente.imagen) {
          const imagenPath = path.join(__dirname, '../../uploads', path.basename(categoriaExistente.imagen));
          if (fs.existsSync(imagenPath)) {
            fs.unlinkSync(imagenPath); // Eliminar el archivo del sistema
          }
        }
      } else {
        // Si no hay nuevo archivo, conservar la imagen existente
        imagen = categoriaExistente.imagen;
      }
  
      const data = {
        descripcion: descripcion || categoriaExistente.descripcion,
        estado_categoria: estado_categoria || categoriaExistente.estado_categoria,
        imagen: imagen,
      };
  
      const updatecategories = await categorieService.PatchCategories(id, data);
  
      res.status(200).json({ message: "Categoría actualizada exitosamente", updatecategories });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };



   const eliminarCategorias= async (req = request, res= response) =>{
    const { id } = req.params;

    try {
      // Buscar la categoría para obtener la imagen
      const categoria = await categorieService.getCategoriesID(id);  // Asegúrate de tener este método implementado
      
      // Si la categoría tiene una imagen
      if (categoria && categoria.imagen) {
        // Construir la ruta absoluta de la imagen
        const imagePath = path.join(__dirname, '../../uploads', path.basename(categoria.imagen));  // Ajusta la ruta a donde guardas las imágenes
        
        // Verificar si la imagen existe
        if (fs.existsSync(imagePath)) {
          // Eliminar la imagen
          fs.unlinkSync(imagePath);
        }
      }
  
      // Eliminar la categoría de la base de datos
      const dato = await categorieService.DeleteCategories(id);
  
      res.status(204).json({ message: 'El dato fue eliminado', dato });
      
    } catch (error) {
      const statusCode = error.status || 500;
      res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
    }
  }


module.exports = {
   obtenercategorias,  
   obtenerCategoriasPorId,
   CrearCategorias,
   ModificarCategorias,
   eliminarCategorias,
   upload
}