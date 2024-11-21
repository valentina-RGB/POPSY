const express = require('express');
const {request , response} = require('express');

const db = require('../../models');
//const Pedidos = db.Pedidos;
const { Adiciones, Insumos, Adiciones_insumo } = require('../../models');

    const 


    getAdiciones = async (res,req) => {
        const adiciones = await Adiciones.findAll(
                {
                  include:[
                   {
                    model: Adiciones,
                    as: 'Adiciones',
                    attributes:['cantidad','descripcion','total']
                   }
                  ]
                }
        );
        res.status(200).json(pedidos);
    }
        
module.exports = {
    getAdiciones
}