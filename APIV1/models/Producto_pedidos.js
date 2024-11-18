module.exports = (sequelize, DataTypes) => {

    const Producto_Pedidos = sequelize.define('Producto_Pedidos', {
    ID_producto_pedido: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ID_pedido: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Pedidos',
        key: 'ID_pedido',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ID_producto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Productos',
        key: 'ID_producto',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio_neto: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    sub_total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    }, {
    tableName: 'Producto_Pedidos',
    timestamps: false
    });

    Producto_Pedidos.associate = function(models) {

 
            Producto_Pedidos.belongsTo(models.Pedidos, {
              foreignKey: 'ID_pedido',
              as: 'Pedido'
            });
            Producto_Pedidos.belongsTo(models.Productos, {
              foreignKey: 'ID_producto',
              as: 'Producto'
            });

    // Relación con Adiciones
    Producto_Pedidos.hasMany(models.Adiciones, { foreignKey: 'ID_producto_pedido', as:'Adiciones'});
   
}


    return Producto_Pedidos;
};