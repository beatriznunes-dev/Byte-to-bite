import { prisma } from "../lib/prisma.js";
import { StatusPedido, MetodoPagamento } from "../generated/prisma/enums.js";

export class PedidoRepository {
  async create(data: {
    usuarioId: string;
    enderecoId?: string;
    retirada: string;
    precoTotal: number;
    itens: { produtoId: number; quantidade: number; precoDaUnidade: number }[];
  }) {
    const { itens, enderecoId, ...pedidoData } = data;

    return prisma.pedido.create({
      data: {
        ...pedidoData,
        ...(enderecoId && { enderecoId }),
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
