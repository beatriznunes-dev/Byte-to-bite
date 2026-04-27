import { PedidoRepository } from "../../repositories/pedido.respository.js";

export class GetPedidoService {
  private pedidoRepository = new PedidoRepository();

  async executarTodos() {
    return this.pedidoRepository.findAll();
  }

  async executarPorUsuario(usuarioId: string) {
    return this.pedidoRepository.findByUsuarioId(usuarioId);
  }
}