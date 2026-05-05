import type{ FastifyRequest, FastifyReply } from "fastify";
import {
  CreatePedidoService,
  GetPedidoService,
  UpdateStatusPedidoService,
} from "../../service/pedido/index.js";
import { StatusPedido } from "../../generated/prisma/enums.js";


export class PedidoController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { usuarioId, enderecoId, nomeCliente, retirada, precoTotal, pagamento, itens } = request.body as {
      usuarioId: string;
      enderecoId?: string;
      nomeCliente: string;
      retirada: string;
      precoTotal: number;
      pagamento?: string;
      itens: { produtoId: number; quantidade: number; precoDaUnidade: number }[];
    };

    const service = new CreatePedidoService();
    const pedido = await service.executar({ usuarioId, enderecoId, nomeCliente, retirada, precoTotal, pagamento, itens });

    return reply.status(201).send(pedido);
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const service = new GetPedidoService();
    const pedidos = await service.executarTodos();

    return reply.status(200).send(pedidos);
  }

  async getByUsuario(request: FastifyRequest, reply: FastifyReply) {
    const { usuarioId } = request.params as { usuarioId: string };

    const service = new GetPedidoService();
    const pedidos = await service.executarPorUsuario(usuarioId);

    return reply.status(200).send(pedidos);
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: StatusPedido };

    const service = new UpdateStatusPedidoService();
    const pedido = await service.executar(id, status);

    return reply.status(200).send(pedido);
  }
}