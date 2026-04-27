import { PedidoRepository } from "../../repositories/pedido.respository.js";
import { UsuarioRepository } from "../../repositories/usuario.repository.js";
import { EnderecoRepository } from "../../repositories/endereco.repository.js";
import { ProdutoRepository } from "../../repositories/produto.repository.js";
import { MetodoPagamento } from "../../generated/prisma/enums.js";

interface CreatePedidoDTO {
  usuarioId: string;
  enderecoId: string;
  itens: { produtoId: number; quantidade: number }[];
}

export class CreatePedidoService {
  private pedidoRepository = new PedidoRepository();
  private usuarioRepository = new UsuarioRepository();
  private enderecoRepository = new EnderecoRepository();
  private produtoRepository = new ProdutoRepository();

  async executar(data: CreatePedidoDTO) {
    const usuario = await this.usuarioRepository.findById(data.usuarioId);
    if (!usuario) throw new Error("Usuário não encontrado");

    const endereco = await this.enderecoRepository.findById(data.enderecoId);
    if (!endereco) throw new Error("Endereço não encontrado");

    if (endereco.usuarioId !== data.usuarioId) {
      throw new Error("Endereço não pertence ao usuário");
    }

    let precoTotal = 0;
    const itensComPreco = [];

    for (const item of data.itens) {
      const produto = await this.produtoRepository.findById(item.produtoId);

      if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`);

      if (produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${produto.nome}`);
      }

      const precoDaUnidade = Number(produto.promocao ?? produto.preco);
      precoTotal += precoDaUnidade * item.quantidade;

      itensComPreco.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoDaUnidade,
      });

      await this.produtoRepository.update(item.produtoId, {
        estoque: produto.estoque - item.quantidade,
      });
    }

    return this.pedidoRepository.create({
      usuarioId: data.usuarioId,
      enderecoId: data.enderecoId,
      precoTotal,
      itens: itensComPreco,
    });
  }
}