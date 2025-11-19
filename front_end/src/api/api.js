// src/api/api.js
import axios from 'axios';

// ⚠️ CAMBIA ESTA IP SI TU COMPUTADORA CAMBIA DE RED
const API_URL = 'http://192.168.3.104:3000'; 

const api = axios.create({
    baseURL: API_URL,
});

export default api;