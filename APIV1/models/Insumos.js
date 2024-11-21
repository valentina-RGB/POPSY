module.exports = (sequelize, DataTypes) => {
  const Insumos = sequelize.define('Insumos', {
    ID_insumo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion_insumo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    estado_insumo: {
      type: DataTypes.CHAR(1),
      defaultValue: 'D',
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
    },
    ID_tipo_insumo: { // Clave foránea para tipo de insumo
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tipo_insumos', // Nombre del modelo relacionado
        key: 'ID_tipo_insumo',
      },
    },
  }, {
    tableName: 'Insumos',
    timestamps: false,
  });

  Insumos.associate = function(models) {
    Insumos.belongsTo(models.Tipo_insumos, { foreignKey: 'ID_tipo_insumo' });
    Insumos.hasMany(models.HistorialEntradas, { foreignKey: 'ID_insumo' });
    Insumos.hasMany(models.Tipo_insumos, {foreignKey: 'ID_tipo_insumo',as: 'Tipos_insumos', });
    Insumos.hasOne(models.StockInsumos, { foreignKey: 'ID_insumo', as: 'stock' });
        // Asociación con productos
    Insumos.belongsToMany(models.Productos, { through: 'Producto_insumos', foreignKey: 'ID_insumos_tipo', otherKey: 'ID_productos_tipo',as: 'productos'});
    Insumos.belongsToMany(models.Adiciones, { through:'Adiciones_Insumos', foreignKey: 'ID_insumo_p', otherKey:'ID_adicion_p', as: 'adicion'});
  };
    
  


  const StockInsumos = require('./StockInsumo'); // Importa el modelo de StockInsumos



  Insumos.afterCreate(async (insumo, options) => {
    try {
      await StockInsumos.create({
        stock_min: 0, // Define valores iniciales o por defecto
        stock_max: 100, // Define valores iniciales o por defecto
        stock_actual: 0, // Define valores iniciales o por defecto
        ID_insumo: insumo.ID_insumo,
        medida: 'unidad', // Define la medida inicial o por defecto
        unidad: 0 // Define la unidad inicial o por defecto
      });
    } catch (error) {
      console.error('Error al crear StockInsumos:', error);
    }
  });

  return Insumos;
};