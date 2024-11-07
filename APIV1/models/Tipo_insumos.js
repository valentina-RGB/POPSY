module.exports = (sequelize, DataTypes) => {
  const Tipo_insumos = sequelize.define('Tipo_insumos', {
    ID_tipo_insumo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion_tipo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Tipo_insumos',
    timestamps: false,
  });
  // Crear datos por defecto después de sincronizar el modelo
  Tipo_insumos.afterSync(async (options) => {
    const defaultTypes = [
      { ID_tipo_insumo: 1, descripcion_tipo: 'vasos' },
      { ID_tipo_insumo: 2,descripcion_tipo: 'helados' },
      { ID_tipo_insumo: 3,descripcion_tipo: 'salsa' }
    ];
    for (const type of defaultTypes) {
      await Tipo_insumos.findOrCreate({ where: { descripcion_tipo: type.descripcion_tipo } });
    }
  });

  Tipo_insumos.associate = function(models) {
    Tipo_insumos.hasMany(models.Insumos, { foreignKey: 'ID_tipo_insumo' });
  };
  return Tipo_insumos;
};