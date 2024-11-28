const express = require('express');
const {request , response} = require('express');

const db = require('../../models');
const Permiso_roles = db.Permiso_roles;

    const 
    getPermise_roles = async (res,req) => {
      const permiso_roles = await Permiso_roles.findAll();
        res.status(200).json(permiso_roles);
    },
        
    getPermise_rolesID = async (id) => {
      const permiso_roles= await Permiso_roles.findByPk(id);
        return permiso_roles;
    } 

    CreatePermise_roles = async (datos) => {
        const permiso_roles = await Permiso_roles.create(datos);
        return permiso_roles;
    };
        
    PatchPermise_roles= async (id, datos) => {
      const [updated] = await Permiso_roles.update(datos, {
        where: { ID_permiso_roles:id },
      });

      if (updated) {
        const updatedPermise_roles = await Permiso_roles.findByPk(id);
        return updatedPermise_roles;

      }else{
        return { status: 404, message: 'Permise_roles not found' };
      }
    },

    DeletePermise_roles = async (id) => {
      const deleted = await Permiso_roles.destroy({ where: {ID_permiso_roles: id}, });
      if (deleted) {
        return deleted;
      }else{
        return {status: 404, message: 'Permise_roles not found' };
      }
    } 


        
        

module.exports = {
    getPermise_roles,
    getPermise_rolesID,
    CreatePermise_roles,
    PatchPermise_roles,
    DeletePermise_roles
}