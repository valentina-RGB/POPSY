module.exports = (sequelize, DataTypes) => {
  const Permisos = sequelize.define('Permisos', {
    ID_permiso: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  },
    {
      tableName: 'Permisos',
      timestamps: false
    });

  // Permiso.associate = function(models) {
  //   Permiso.hasMany(models.Usuarios, { foreignKey: 'ID_usuario' });

  //   Permiso.belongsTo(models.Usuarios, { foreignKey: 'ID_usuario' });
  // };
  Permisos.associate = function(models) {
    // Permisos.hasMany(models.Permiso_roles, {foreignKey: 'ID_permiso'})
    Permisos.belongsToMany(models.Roles, { through:'Permiso_roles', foreignKey:'ID_permisos', otherKey:'ID_roles', as:'roles' });
  };
  

  return Permisos;
};
