import { prisma } from "../lib/prisma.js";
import { StatusPedido } from "../generated/prisma/enums.js";

export class PedidoRepository {
  async create(data: {
    usuarioId: string;
    enderecoId: string;
    precoTotal: number;
    imagemUrl?: string;
    itens: { produtoId: number; quantidade: number; precoDaUnidade: number }[];
  }) {
    const { itens, ...pedidoData } = data;

    return prisma.$transaction(async (tx) => {
      for (const item of itens) {
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
          select: { id: true, estoque: true, nome: true },
        });

        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`);
        }

        if (produto.estoque < item.quantidade) {
          throw new Error(
            `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}, solicitado: ${item.quantidade}`
          );
        }

        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoque: { decrement: item.quantidade } },
        });
      }

      return tx.pedido.create({
        data: {
          ...pedidoData,
          item: {
            create: itens.map((i) => ({
              produtoId: i.produtoId,
              quantidade: i.quantidade,
              precoDaUnidade: i.precoDaUnidade,
            })),
          },
        },
        include: { item: true },
      });
    });
  }

  async findAll() {
    return prisma.pedido.findMany({
      include: { item: true, usuario: true, endereco: true },
    });
  }

  async findByUsuarioId(usuarioId: string) {
    return prisma.pedido.findMany({
      where: { usuarioId },
      include: { item: true, endereco: true },
    });
  }

  async findById(id: string) {
    return prisma.pedido.findUnique({
      where: { id },
      include: { item: true, endereco: true },
    });
  }

  async updateStatus(id: string, status: StatusPedido) {
    return prisma.pedido.update({
      where: { id },
      data: { status },
    });
  }
}