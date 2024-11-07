'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addIndex('Categorias', ['descripcion'], {
      unique: true,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Categorias', ['descripcion']);
  }
};
