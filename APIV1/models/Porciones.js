module.exports = (sequelize, DataTypes) => {
    const Porciones = sequelize.define('Porciones', {
      ID_porcion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      medida: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      ID_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Productos', // Nombre de la tabla referenciada
          key: 'ID_producto', // Columna en la tabla referenciada
        },
      },
      numero_porcion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'Porciones',
      timestamps: false, // Si no tienes columnas createdAt y updatedAt
    });
  
    // Aquí defines las asociaciones si hay alguna
    Porciones.associate = (models) => {
      Porciones.belongsTo(models.Productos, {
        foreignKey: 'ID_producto',
        as: 'producto', 
      });
    };
  
    return Porciones;
  };