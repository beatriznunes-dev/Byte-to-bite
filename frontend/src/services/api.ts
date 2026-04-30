import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

/**
 * Configuração da Base URL:
 */
const API_URL = 'http://localhost:3333'; 

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTOR DE REQUISIÇÃO
 * Este código intercepta cada chamada à API e verifica se existe um token no localStorage.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('@ByteToBite:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * INTERCEPTOR DE RESPOSTA
 * Caso o token expire ou seja inválido (Erro 401), podemos deslogar o usuário automaticamente.
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@ByteToBite:token');
    }
    return Promise.reject(error);
  }
);