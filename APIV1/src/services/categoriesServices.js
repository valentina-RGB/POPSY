const express = require('express');
const {request , response} = require('express');

const db = require('../../models');
const Categoria = db.Categorias;

    const 


    getCategorie = async (res,req) => {
      const categoria = await Categoria.findAll();
        res.status(200).json(categoria);
    },
        
    getCategoriesID = async (id) => {
      const categorias = await Categoria.findByPk(id);
        return categorias;
    } ,

    CreateCategories = async (datos) => {
        const categorias = await Categoria.create(datos);
        return categorias;

    },
        
    PatchCategories = async (id, datos) => {
      const [updated] = await Categoria.update(datos, {
        where: { ID_categoria:id },
      });

      if (updated) {
        const updatedCategoria = await Categoria.findByPk(id);
        return updatedCategoria;
      }else{
        return { status: 404, message: 'categoria not found' };
      }
    },

    DeleteCategories = async (id) => {
      const deleted = await Categoria.destroy({ where: {ID_categoria: id}, });
      if (deleted) {
        return deleted;
      }else{
        return {status: 404, message: 'categoria not found' };
      }


    } 


        
        

module.exports = {
    getCategorie,
    getCategoriesID,
    CreateCategories,
    PatchCategories,
    DeleteCategories,
}