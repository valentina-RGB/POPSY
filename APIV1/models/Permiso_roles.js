module.exports = (sequelize, DataTypes) => {
  const Permiso_roles = sequelize.define('Permiso_roles', {
    ID_rol_permiso: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_roles: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'ID_rol',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'  
    },
    ID_permisos: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Permisos',
        key: 'ID_permiso',
      }, 
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'  
    }
  }, {
    tableName: 'Permiso_roles',
    timestamps: false,
  });

  // Permiso_roles.associate = function (models) {
  //   Permiso_roles.belongsTo(models.Permisos, { foreignKey: 'ID_permiso' });
  // };
  // Permiso_roles.associate = function (models) {
  //   Permiso_roles.belongsTo(models.Roles, { foreignKey: 'ID_rol' });
  // };


  return Permiso_roles;
};