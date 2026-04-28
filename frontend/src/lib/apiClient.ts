/// <reference types="vite/client" />
import axios from 'axios';

const apiClient = axios.create({
  baseURL: (window as any).__ENV__?.API_URL || import.meta.env.VITE_API_URL,
});

export default apiClient;
