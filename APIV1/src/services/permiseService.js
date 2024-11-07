const express = require('express');
const { request, response } = require('express');

const db = require('../../models');
const Permisos = db.Permisos;

const


  getPermiso = async (res, req) => {
    const permisos = await Permisos.findAll();
    res.status(200).json(permisos);
  },

  getPermisoID = async (id) => {
    const permisos = await Permiso.findByPk(id);
    return permisos;
  },

  CreatePermiso = async (datos) => {
    const permisos = await Permiso.create(datos);
    return permisos;

  };

PatchPermiso = async (id, datos) => {
  const [updated] = await Permiso.update(datos, {
    where: { ID_permiso: id },
  });

  if (updated) {
    const updatedpermiso = await Permiso.findByPk(id);
    return updatedpermiso;
  } else {
    return { status: 404, message: 'permiso not found' };
  }
},

  DeletePermiso = async (id) => {
    const deleted = await Permiso.destroy({ where: { ID_permiso: id }, });
    if (deleted) {
      return deleted;
    } else {
      return { status: 404, message: 'permiso not found' };
    }


  }





module.exports = {
  getPermiso,
  getPermisoID,
  CreatePermiso,
  PatchPermiso,
  DeletePermiso
}
