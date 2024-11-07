module.exports = (sequelize, DataTypes) => {

    const Producto_insumos = sequelize.define('Producto_insumos', {
    ID_producto_insumo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ID_insumos_tipo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Insumos',
        key: 'ID_insumo',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ID_productos_tipo: {
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
    configuracion: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
    }, {
    tableName: 'Producto_insumos',
    timestamps: false,
    });


    return Producto_insumos;
};