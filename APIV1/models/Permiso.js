module.exports = (sequelize, DataTypes) => {
  const Permisos = sequelize.define('Permisos', {
    ID_permiso: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },
  },
    {
      tableName: 'Permisos',
      timestamps: false,
    });

  // Permiso.associate = function(models) {
  //   Permiso.hasMany(models.Usuarios, { foreignKey: 'ID_usuario' });

  //   Permiso.belongsTo(models.Usuarios, { foreignKey: 'ID_usuario' });
  // };
  Permisos.asociate = function(models) {
    Permisos.hasMany(models.Permiso_roles, {foreignKey: 'ID_permiso'})
  };
  

  return Permisos;
};
