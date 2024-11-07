module.exports = (sequelize, DataTypes) => {
  const StockInsumos = sequelize.define('StockInsumos', {
    ID_stock_insumo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    stock_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock_max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ID_porcion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ID_insumo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Insumos',
        key: 'ID_insumo',
      },
    },
    medida: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    unidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'Stock_insumos',
    timestamps: false,
  });

  StockInsumos.associate = (models) => {
    StockInsumos.belongsTo(models.Insumos, { foreignKey: 'ID_insumo', as: 'insumo' });

    // Si tienes la tabla Porciones en tu modelo
    StockInsumos.belongsTo(models.Porciones, {
      foreignKey: 'ID_porcion',
      as: 'porcion',
    });
  };

  return StockInsumos;
};