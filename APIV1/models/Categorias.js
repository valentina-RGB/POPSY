
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
  const Categorias = sequelize.define('Categorias', {
    ID_categoria: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING(100), 
      allowNull: false,
      unique: true
    },
    estado_categoria: {
      type: DataTypes.CHAR(1),
      defaultValue: 'A',
    },
    imagen: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    tableName: 'Categorias',
    timestamps: false,
  });

  Categorias.associate = function (models){
  Categorias.hasMany(models.Productos, { foreignKey: 'ID_categorias'});
  } 
  
  return Categorias;
};