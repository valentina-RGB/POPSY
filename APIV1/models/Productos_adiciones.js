module.exports = (sequelize, DataTypes) => {

    const Productos_adiciones = sequelize.define('Productos_adiciones', {
    ID_Productos_adiciones: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ID_Producto_adicion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Productos',
        key: 'ID_producto',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ID_adiciones: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Adiciones',
        key: 'ID_adicion',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    }, {
    tableName: 'Productos_adiciones',
    timestamps: false,
    });

    return Productos_adiciones;
};