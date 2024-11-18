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
      unique: true, // Mantén solo si necesitas que sea único
      allowNull: true,
    },
    documento: {
      type: DataTypes.BIGINT,
      unique: true, // Mantén solo si es necesario que sea único
      defaultValue: 123456789456,  
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true, // Eliminé el 'unique' aquí
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: true, // Eliminé el 'unique' aquí
    },
  }, {
    tableName: 'Clientes',
    timestamps: false,
  });
    
      return Clientes;
    };