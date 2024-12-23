module.exports = (sequelize, DataTypes) => {
  const Clientes = sequelize.define('Clientes', {
    ID_cliente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    estado_cliente: {
      type: DataTypes.CHAR(1),
      defaultValue: 'A',
    },
    correo_electronico: {
      type: DataTypes.STRING(100),
      unique: true, 
      allowNull: true,
    },
    documento: {
      type: DataTypes.BIGINT,
      unique: true,
      defaultValue: 123456789456,  
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true, 
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: true, 
    },
  }, {
    tableName: 'Clientes',
    timestamps: false,
  });
    
      return Clientes;
    };