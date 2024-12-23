const express = require('express');
const { request, response } = require('express');
// const {Permisos}= require('../../models');
const {Permisos, Roles ,Permiso_roles} = require('../../models');
const { sequelize } = require('../../models'); 
const


  getRol = async (res, req) => {
    const roles = await Roles.findAll(); 
    res.status(200).json(roles);
  },

  getRolesID = async (id) => {
    return await Roles.findByPk(id, {
      include: [{
        model: Permisos,
        as: 'Permiso', // Coincide con el alias en la asociación
        through: { attributes: [] }, // No se necesita información de la tabla intermedia
      }],
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
        ID_permisos: permisos,
        ID_roles: rol.ID_rol
       })

       console.log(permisos)
    }


    // await Permiso_roles.bulkCreate(rolPermiso);

    return rol;
  },

  
  PatchRoles = async (id, datos) => {
    const { ID_permiso, descripcion, estado_rol } = datos;
  
    // Primero, actualiza el rol en la tabla Roles
    const [updated] = await Roles.update(
      { descripcion, estado_rol },
      { where: { ID_rol: id } }
    );
  
    // if (!updated) {
    //   // Si no se encontró el rol, devuelve un mensaje de error
    //   return { status: 404, message: 'Role not found' };
    // }
  
    // Si se proporcionaron permisos, actualiza la tabla intermedia Permiso_roles
      // Elimina los permisos anteriores asociados a este rol
     
      if(ID_permiso){
        await Permiso_roles.destroy({
          where: { ID_roles: id }
        });
  
        console.log(ID_permiso)
    
        // Agrega los nuevos permisos asociados al rol
        for (const permisoId of ID_permiso) {
          await Permiso_roles.create({
            ID_permisos: permisoId,
            ID_roles: id
          });
        }
  
      }

      return { status: 200, message: 'Hecho' }
    
  
    // Retorna el rol actualizado, incluyendo sus permisos
    // return await Roles.findByPk(id, {
    //   include: [{
    //     model: Permisos,
    //     as: 'Permiso' // Usa el alias correcto de la asociación
    //   }],
    // });
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