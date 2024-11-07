module.exports = (sequelize, DataTypes) => {

    const Producto_Pedidos = sequelize.define('Producto_Pedidos', {
    ID_producto_pedido: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ID_pedidos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Pedidos',
        key: 'ID_pedido',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ID_productos: {
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
    return Producto_Pedidos;
};