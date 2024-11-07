module.exports = (sequelize, DataTypes) => {
    const Estado_producto = sequelize.define('Estado_producto', {
        ID_estado_producto: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        estado: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'Estado_producto',
        timestamps: false,
    });

    // Estado_producto.associate = function(models) {
    //     Estado_producto.hasMany(models.Productos, { foreignKey: 'ID_estado_productos' });
    // };

    Estado_producto.sync({ force: false }) // Usa 'force: false' para no sobreescribir la tabla si ya existe
  .then(async () => {
    // Datos por defecto
    const data = [
      {ID_estado_producto: 1 , estado: 'Disponible' },
      {ID_estado_producto: 2 , estado: 'Agotado' },
    ];

    // Insertar solo si no existen registros
    const count = await Estado_producto.count();
    if (count === 0) {
      await Estado_producto.bulkCreate(data);
      console.log('Datos por defecto creados');
    }
  })
  .catch((error) => console.error('Error al crear datos por defecto:', error));

    return Estado_producto;
};
