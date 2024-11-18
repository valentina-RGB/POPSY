const express = require('express');
const { request, response } = require('express');
// const {Permisos}= require('../../models');
const {Permisos, Roles ,Permiso_roles} = require('../../models');
const


  getRol = async (res, req) => {
    const roles = await Roles.findAll(); 
    res.status(200).json(roles);
  },

  getRolesID = async (id) => {
    return await Roles.findByPk(id, {
      include:[
        {
          model:Permisos,
          as: 'Permiso0',
        }
      ]
    });
    
  },
  CreateRoles = async (datos) => {

    const {
      ID_permiso,
      descripcion,
      estado_rol
    } = datos;

    const rol = await Roles.create({
      descripcion,
      estado_rol
    });

    for(const permisos of ID_permiso){
      await Permiso_roles.create({
        ID_permiso: permisos,
        ID_rol: rol.ID_rol
       })

       console.log(permisos)
    }


    // await Permiso_roles.bulkCreate(rolPermiso);

    return rol;
  },

  PatchRoles = async (id, datos) => {
    const [updated] = await Roles.update(datos, {
      where: { ID_rol: id },
    });

    if (updated) {
      const updatedroles = await Roles.findByPk(id);
      return updatedroles;
    } else {
      return { status: 404, message: 'roles not found' };
    }
  },

  DeleteRoles = async (id) => {
    const deleted = await Roles.destroy({ where: { ID_rol: id }, });
    if (deleted) {
      return deleted;
    } else {
      return { status: 404, message: 'roles not found' };
    }


  }





module.exports = {
  getRol,
  getRolesID,
  CreateRoles,
  PatchRoles,
  DeleteRoles,
}