module.exports = (sequelize, DataTypes) => {

const EstadoPedido = sequelize.define('EstadoPedido', {
  ID_estado_pedido: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: true 
  }
}, {
  tableName: 'Estado_pedidos',
  timestamps: false // Ajusta esto según tus necesidades
});

EstadoPedido.associate = function(models) {
  EstadoPedido.hasMany(models.Pedidos, { foreignKey: 'ID_estado_pedido' });
  };

return EstadoPedido;
}