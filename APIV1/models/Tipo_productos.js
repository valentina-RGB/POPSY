const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tipo_productos = sequelize.define('Tipo_productos', {
    ID_tipo_producto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
  }, {
    tableName: 'Tipo_productos',
    timestamps: false,
  });



  Tipo_productos.sync({ alter: false }) // Usa 'force: false' para no sobreescribir la tabla si ya existe
  .then(async () => {
    // Datos por defecto
    const data = [
      {ID_tipo_producto: 1, descripcion: 'Pequeño' },
      {ID_tipo_producto: 2, descripcion: 'Mediano' },
      {ID_tipo_producto: 3, descripcion: 'Grande' },
      {ID_tipo_producto: 4, descripcion: 'Especial' },
      {ID_tipo_producto: 5,descripcion: 'No aplica' },
    ];

    // Insertar solo si no existen registros
    const count = await Tipo_productos.count();
    if (count === 0) {
      await Tipo_productos.bulkCreate(data);
      console.log('Datos por defecto creados');
    }
  })
  .catch((error) => console.error('Error al crear datos por defecto:', error));



  return Tipo_productos;

  
};

