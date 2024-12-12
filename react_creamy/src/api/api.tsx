import axios from 'axios';

const api = axios.create({
  baseURL: 'https://creamy-soft.onrender.com/', // URL de tu API
});

export default api;