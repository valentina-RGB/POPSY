const express = require('express');
const {request , response} = require('express');

const db = require('../../models');
const User = db.Usuarios;

  const 
    getUser = async (res,req) => {
      const user = await User.findAll();
        res.status(200).json(user);
    },
        
    getUsersID = async (id) => {
      const users = await User.findByPk(id);
        return users;
    } ,

    CreateUsers = async (datos) => {
        const users = await User.create(datos);
        return users;

    },
        
    PatchUsers = async (id, datos) => {
      const [updated] = await User.update(datos, {
        where: { ID_usuario:id },
      });

      if (updated) {
        const updatedUser = await User.findByPk(id);
        return updatedUser;
      }else{
        return { status: 404, message: 'user not found' };
      }
    },

    DeleteUsers = async (id) => {
      const deleted = await User.destroy({ where: {ID_usuario: id}, });
      if (deleted) {
        return deleted;
      }else{
        return {status: 404, message: 'user not found' };
      }


    } 


        
        

module.exports = {
    getUser,
    getUsersID,
    CreateUsers,
    PatchUsers,
    DeleteUsers,
}