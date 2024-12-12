const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const dotenv = require('dotenv');

dotenv.config(); // Cargar las variables de entorno desde .env

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || 
    !process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_DIALECT) {
  throw new Error('Faltan variables de entorno para la configuración de la base de datos');
}

let sequelize;
sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      ca: process.env.DB_SSL_MODE === 'REQUIRED'
        ? fs.readFileSync(path.resolve(__dirname, 'ca.pem')).toString()
        : undefined,
    },
    connectTimeout: 60000, // Aumenta el tiempo de espera
  },
  define: {
    timestamps: false, // Opcional: evita timestamps automáticos si no los usas
  },
});

// Autenticar conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', {
      message: err.message,
      stack: err.stack,
      original: err.original,
    });
  });

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
