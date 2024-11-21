module.exports = (sequelize, DataTypes) => {

  const Producto_Ventas = sequelize.define('Producto_Ventas', {
  ID_producto_venta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  ID_venta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
      model: 'Ventas',
      key: 'ID_venta',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
  },
  ID_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
      model: 'Productos',
      key: 'ID_producto',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
  },
  cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  precio_neto: {
      type: DataTypes.FLOAT,
      allowNull: false
  },
  sub_total: {
      type: DataTypes.FLOAT,
      allowNull: false
  },
  }, {
  tableName: 'Producto_Ventas',
  timestamps: false
  });

  Producto_Ventas.associate = function(models) {


          Producto_Ventas.belongsTo(models.ventas, {
            foreignKey: 'ID_venta',
            as: 'Venta'
          });
          Producto_Ventas.belongsTo(models.Productos, {
            foreignKey: 'ID_producto',
            as: 'Producto'
          });

  // Relación con Adiciones
  Producto_Ventas.hasMany(models.Adiciones, { foreignKey: 'ID_producto_venta', as:'Adiciones'});
 
}


  return Producto_Ventas;
};