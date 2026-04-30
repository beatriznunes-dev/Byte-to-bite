import { api } from './api';
import type { Pedido, StatusPedido } from '../types/types';

export const ordersService = {
  // Lista todos (para a Cozinha/Admin)[cite: 5, 11]
  getAll: async (): Promise<Pedido[]> => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  // Cria novo pedido (para o POS)[cite: 11]
  create: async (pedidoData: { usuarioId: string; enderecoId: string; itens: any[] }) => {
    const response = await api.post('/pedidos', pedidoData);
    return response.data;
  },

  // Muda o status (Cozinha clicando em "Preparar" ou "Finalizar")[cite: 5, 11]
  updateStatus: async (id: string, status: StatusPedido) => {
    const response = await api.patch(`/pedidos/${id}/status`, { status });
    return response.data;
  }
};