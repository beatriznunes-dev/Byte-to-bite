import { PedidoRepository } from "../../repositories/pedido.respository.js";
import { StatusPedido } from "../../generated/prisma/enums.js";

export class UpdateStatusPedidoService {
  private pedidoRepository = new PedidoRepository();

  async executar(pedidoId: string, status: StatusPedido) {
    const pedido = await this.pedidoRepository.findById(pedidoId);

    if (!pedido) throw new Error("Pedido não encontrado");

    return this.pedidoRepository.updateStatus(pedidoId, status);
  }
}