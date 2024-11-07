const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>{
    const Adiciones = sequelize.define('Adiciones', {
        ID_adicion:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cantidad:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull:true
        }
    })

    Adiciones.associate = (models)=>{
        Adiciones.belongsToMany(models.Productos, {through:'Productos_adiciones', foreignKey: 'ID_adiciones', otherKey: 'ID_Producto_adicion', as:'producto'});
        Adiciones.belongsToMany(models.Insumos, {through:'Adiciones_Insumos', foreignKey: 'ID_adicion_p', otherKey: 'ID_insumo_p', as:'insumos'});
    }
    return Adiciones;
}