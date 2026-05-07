import { api } from './api';
import type { Pedido, StatusPedido, ItemPedido } from '../types/types';

// Interface para os dados necessários na criação de um pedido
interface CreatePedidoDTO {
  usuarioId: string;
  enderecoId: string;
  itens: Array<{
    produtoId: number;
    quantidade: number;
    observacao?: string;
  }>;
}

export const ordersService = {
  // Lista todos (para a Cozinha/Admin)
  getAll: async (): Promise<Pedido[]> => {
    // Definimos que o retorno do get é um array de Pedidos
    const response = await api.get<Pedido[]>('/pedidos');
    return response.data;
  },

  // Cria novo pedido (para o POS)
  create: async (pedidoData: CreatePedidoDTO): Promise<Pedido> => {
    // Tipamos o envio e o retorno da criação
    const response = await api.post<Pedido>('/pedidos', pedidoData);
    return response.data;
  },

  // Muda o status (Cozinha clicando em "Preparar" ou "Finalizar")
  updateStatus: async (id: string, status: StatusPedido): Promise<Pedido> => {
    // Tipamos o retorno do patch
    const response = await api.patch<Pedido>(`/pedidos/${id}/status`, { status });
    return response.data;
  }
};