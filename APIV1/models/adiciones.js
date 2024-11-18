const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>{
    const Adiciones = sequelize.define('Adiciones', {
        ID_adicion:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ID_producto_pedido:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Producto_Pedidos',
                key: 'ID_producto_pedido',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'       
                
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull:true
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull:true
        }
    },{
        tableName: 'Adiciones',
        timestamps: false
    })

    Adiciones.associate = (models)=>{
        Adiciones.belongsToMany(models.Insumos, { through:'Adiciones_Insumos', foreignKey:'ID_adicion_p', otherKey: 'ID_insumo_p', as: 'Insumos'});
        Adiciones.belongsTo(models.Producto_Pedidos, {foreignKey: 'ID_producto_pedido' });
        //Producto_Pedidos.hasMany(models.Adiciones, { foreignKey: 'ID_producto_pedidos', as:'Adiciones'});
    }
    return Adiciones;
}