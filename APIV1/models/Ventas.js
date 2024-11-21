module.exports = (sequelize, DataTypes) => {
  const Ventas = sequelize.define('Ventas', {
  ID_venta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
  },
  cliente: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: 'Por favor ingrese el cliente',
  },
  precio_total: {
      type: DataTypes.FLOAT,
      allowNull: true
  },
  ID_estado_venta: {
      type: DataTypes.INTEGER,
      references: {
      model: 'Estado_ventas',
      key: 'ID_estado_venta'
      },
  },
  },{
  tableName: 'Ventas',
  timestamps: false,
  });

  Ventas.associate = function(models) {
   
      Ventas.belongsToMany(models.Productos, { through:models.Producto_Ventas, foreignKey: 'ID_venta', otherKey: 'ID_producto', as: 'ProductosLista' });
      Ventas.belongsTo(models.Estado_ventas, { foreignKey: 'ID_estado_venta', as: 'Estado' });
      
  }
  return Ventas;
}; 