import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3300/', // URL de tu API
});

export default api;