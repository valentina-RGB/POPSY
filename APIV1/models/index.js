const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const dotenv = require('dotenv');
dotenv.config(); // Cargar las variables de entorno desde .env
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    dialectOptions: process.env.DB_SSL_MODE === 'REQUIRED' ? {
      ssl: {
          require: true,
          ca: fs.readFileSync(path.resolve(__dirname, 'ca.pem')).toString(),
          rejectUnauthorized: true
      },
      connectTimeout: 120000
  } : {},
  define: {
      timestamps: false // Opcional: evita timestamps automáticos si no los usas
  },
  logging: console.log
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
