
const producto_pedidos = require("./producto_pedidos");

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
    ID_clientes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Clientes',
            key: 'ID_cliente',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    // ID_adicion: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //     model: 'Adiciones',
    //     key: 'ID_adicion'
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE',
    // },
    },{
    tableName: 'Pedidos',
    timestamps: false,
    });

    Pedidos.associate = function(models) {
      
         //RELACION  MUCHO A MUCHOS
         Pedidos.belongsToMany(models.Productos, { through:models.Producto_Pedidos, foreignKey: 'ID_pedidos', otherKey: 'ID_productos', as: 'ProductosLista' });
    
    }
    return Pedidos;
}; 