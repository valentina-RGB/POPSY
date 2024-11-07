const { Sequelize } = require('sequelize');
const db = new Sequelize('api_final', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false ,
  logging: console.log
});
// broooo?
db.authenticate()
  .then(() => {
    console.log('Conectado a la base de datos.');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });
module.exports = {
  db
};