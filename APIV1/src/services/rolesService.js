const express = require('express');
const { request, response } = require('express');

const db = require('../../models');
const Roles = db.Roles;
const Permisos = db.Permisos;
const Permiso_roles = db.Permiso_roles;

const


  getRol = async (res, req) => {
    const roles = await Roles.findAll(); 
    res.status(200).json(roles);
  },

  getRolesID = async (id) => {
    const roles = await Roles.findByPk(id);
    return roles;
  },

  CreateRoles = async (datos) => {

    const {
      ID_permisos,
      descripcion,
      estado_rol
    } = datos;

    const rol = await Roles.create({
      descripcion,
      estado_rol
    });

    const rolPermiso = ID_permisos.map(permiso => ({
      ...permiso,
      ID_permiso: permiso,
      ID_rol: rol.id
    }))

    await Permiso_roles.bulkCreate(rolPermiso);

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