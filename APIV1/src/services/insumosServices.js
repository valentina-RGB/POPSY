const Insumo = require('../models/insumos');
const StockInsumo = require('../models/StockInsumo');


const getInsumoById = async (id) => {
    try {
        const insumo = await Insumo.findByPk(id);
        
        if (!insumo) {
            throw {status: 404, message: 'Insumo not found' };
        }
        return { status: 200, data: insumo };
    } catch (error) {
        throw { status: 500, message: 'Error fetching insumo' };
    }

    I
};


const getAllInsumos = async () => {
    try {
        const insumos = await Insumo.findAll();
        return { status: 200, data: insumos };
    } catch (error) {
        throw { status: 500, message: 'Error fetching insumos' };
    }
};


const createInsumo = async (insumoData) => {
    try {
        const newInsumo = await Insumo.create(insumoData);
        return { status: 201, data: newInsumo };
    } catch (error) {
        throw { status: 500, message: 'Error creating insumo' };
    }
};


const updateInsumo = async (id, insumoData) => {
    try {
        const insumo = await Insumo.findByPk(id);
        if (!insumo) {
            throw { status: 404, message: 'Insumo not found' };
        }
        await insumo.update(insumoData);
        return { status: 200, data: insumo };
    } catch (error) {
        throw { status: 500, message: 'Error updating insumo' };
    }
};


const deleteInsumo = async (id) => {
    try {
        const insumo = await Insumo.findByPk(id);
        if (!insumo) {
            throw { status: 404, message: 'Insumo not found' };
        }
        await insumo.destroy();
        return { status: 200, message: 'Insumo deleted successfully' };
    } catch (error) {
        throw { status: 500, message: 'Error deleting insumo' };
    }
};


const agregarEntrada = async (entrada) => {
    const { ID_insumo, cantidad } = entrada;

    try {
        const insumo = await Insumo.findByPk(ID_insumo);
        if (!insumo) {
            throw { status: 404, message: 'Insumo not found' };
        }

        const stock = await StockInsumo.findOne({ where: { ID_porcion: ID_insumo } });
        if (!stock) {
            throw { status: 404, message: 'Stock not found for the insumo' };
        }

        stock.stock_actual = (stock.stock_actual || 0) + cantidad;
        await stock.save();

        return { status: 200, message: 'Stock updated successfully' };
    } catch (error) {
        throw { status: 500, message: 'Error updating stock' };
    }
};

module.exports = {
    getInsumoById,
    getAllInsumos,
    createInsumo,
    updateInsumo,
    deleteInsumo,
    agregarEntrada
};
