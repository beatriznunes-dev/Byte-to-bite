import axios, { 
  type AxiosInstance, 
  type InternalAxiosRequestConfig, 
  type AxiosResponse 
} from 'axios';

/**
 * URL da API: 
 * Em produção (Vercel), usará a variável VITE_API_URL.
 * Em desenvolvimento local, usará o localhost:3333.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTOR DE REQUISIÇÃO
 * Adiciona o token de autenticação automaticamente.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('@ByteToBite:token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

/**
 * INTERCEPTOR DE RESPOSTA
 * Gerencia erros globais, como token expirado (401).
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: { response?: { status: number } }) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@ByteToBite:token');
      // Opcional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);