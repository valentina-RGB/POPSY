module.exports = (sequelize, DataTypes) => {
  const HistorialEntradas = sequelize.define('HistorialEntradas', {
    ID_entrada: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_insumo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Insumos',
        key: 'ID_insumo',
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  }, {
    tableName: 'HistorialEntradas',
    timestamps: false,
  });

  HistorialEntradas.associate = function(models) {
    HistorialEntradas.belongsTo(models.Insumos, { foreignKey: 'ID_insumo' });
  };

  return HistorialEntradas;
};
