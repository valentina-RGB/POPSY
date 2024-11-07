module.exports = (sequelize, DataTypes) => {

    const Adiciones_Insumos = sequelize.define('Adiciones_Insumos', {
    ID_Adiciones_Insumos: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ID_adicion_p: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Adiciones',
        key: 'ID_adicion',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ID_insumo_p: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Insumos',
        key: 'ID_insumo',
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
    tableName: 'Adiciones_Insumos',
    timestamps: false,
    });

    return Adiciones_Insumos;
};