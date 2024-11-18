module.exports = (sequelize, DataTypes) => {
    const Pedidos = sequelize.define('Pedidos', {
    ID_pedido: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    cliente: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Por favor ingrese el cliente',
    },
    precio_total: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ID_estado_pedido: {
        type: DataTypes.INTEGER,
        references: {
        model: 'Estado_pedidos',
        key: 'ID_estado_pedido'
        },
    },
    },{
    tableName: 'Pedidos',
    timestamps: false,
    });

    Pedidos.associate = function(models) {
     
        Pedidos.belongsToMany(models.Productos, { through:models.Producto_Pedidos, foreignKey: 'ID_pedido', otherKey: 'ID_producto', as: 'ProductosLista' });
        
    }
    return Pedidos;
}; 