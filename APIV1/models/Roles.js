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
    // ID_permiso: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "Permiso",
    //     key: "ID_permiso"
    //   }
    // }
  }, {
    tableName: 'Roles',
    timestamps: false,
  });

  Roles.asociate = function(models) {
    Roles.hasMany(models.Permiso_roles, {foreignKey: 'ID_rol'})
  };

  // Roles.associate = function(models) {
  //   Roles.hasMany(models.Permiso, { foreignKey: 'ID_permiso' }

  //   );
  // }
  return Roles;
};