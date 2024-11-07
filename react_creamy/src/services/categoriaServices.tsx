import axios from 'axios';

const API_URL = 'https://3300/categorias';

type Props = {
    id: number;
    nombre : string
    estado : string
}


  
export const getItems = async () => {
    return await axios.get(`${API_URL}/$items`);
};

export const getItemById = async (id:Props) => {
    return await axios.get(`${API_URL}/items/${id.id}`);
};

export const addItem = async (item:Props) => {
    return await axios.post(`${API_URL}/items`, item);
};

export const updateItem = async (item:Props) => {
    return await axios.put(`${API_URL}/items/${item.id}`, item);
};

export const deleteItem = async (id:Props) => {
    return await axios.delete(`${API_URL}/items/${id.id}`);
};
