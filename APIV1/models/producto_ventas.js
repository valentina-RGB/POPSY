module.exports = (sequelize, DataTypes) => {
    const Producto_Ventas = sequelize.define('Producto_Ventas', {
      ID_producto: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Productos',
          key: 'ID_producto'
        }
      },
      ID_venta: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Ventas',
          key: 'ID_venta'
        }
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      precio: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    }, {
      tableName: 'Producto_Ventas',
      timestamps: false,
    });
  
    return Producto_Ventas;
  };
  