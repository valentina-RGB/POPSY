module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    ID_rol: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING(100),
    },
    estado_rol: {
      type: DataTypes.CHAR(1),
      defaultValue: 'D',
      allowNull: false,
    },
  }, {
    tableName: 'Roles',
    timestamps: false,
  });

  Roles.asociate = function(models) {
    // Roles.hasMany(models.Permiso_roles, {foreignKey: 'ID_rol'})
    Roles.belongsToMany(models.Permisos, { through:'Permiso_roles', foreignKey: 'ID_roles', otherKey: 'ID_permisos', as: 'Permisoo' });
  };

  return Roles;
};