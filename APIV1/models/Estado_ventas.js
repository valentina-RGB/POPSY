module.exports = (sequelize, DataTypes) => {
    const Estado_ventas = sequelize.define('Estado_ventas', {
        ID_estado_venta: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        descripcion: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        estado: {
            type: DataTypes.CHAR(1),
            defaultValue: 'A',
        },
    }, {
        tableName: 'Estado_ventas',
        timestamps: false,
    });

    Estado_ventas.associate = function(models) {
        Estado_ventas.hasMany(models.Ventas, { foreignKey: 'ID_estado_venta' });
    };

    return Estado_ventas;
};
