import { api } from '../../../services/api'; 

export const stockService = {
  // Cria novo insumo
  create: async (nome: string, estoque: number) => {
    const response = await api.post('/ingredientes', { nome, estoque });
    return response.data;
  },

  // Atualiza quantidade ou nome
  update: async (id: number, data: { nome?: string; estoque?: number }) => {
    const response = await api.put(`/ingredientes/${id}`, data);
    return response.data;
  },

  // Deleta insumo
  delete: async (id: number) => {
    await api.delete(`/ingredientes/${id}`);
  }
};