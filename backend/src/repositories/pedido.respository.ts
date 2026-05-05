import { prisma } from "../lib/prisma.js";
import { StatusPedido, MetodoPagamento } from "../generated/prisma/enums.js";

export class PedidoRepository {
  async create(data: {
    usuarioId: string;
    enderecoId?: string;
    nomeCliente: string;
    retirada: string;
    precoTotal: number;
    pagamento?: MetodoPagamento; // ← era string, agora tipado corretamente
    itens: { produtoId: number; quantidade: number; precoDaUnidade: number }[];
  }) {
    const { itens, enderecoId, pagamento, ...pedidoData } = data;

    return prisma.pedido.create({
      data: {
        ...pedidoData,
        ...(enderecoId && { enderecoId }),
        ...(pagamento && { pagamento }),
        item: {
          create: itens.map((i) => ({
            produtoId: i.produtoId,
            quantidade: i.quantidade,
            precoDaUnidade: i.precoDaUnidade,
          })),
        },
      },
      include: { item: { include: { produto: true } } },
    });
  }

  async findAll() {
    return prisma.pedido.findMany({
      include: {
        item: { include: { produto: true } },
        usuario: true,
        endereco: true,
      },
    });
  }

  async findByUsuarioId(usuarioId: string) {
    return prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        item: { include: { produto: true } },
        endereco: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.pedido.findUnique({
      where: { id },
      include: {
        item: { include: { produto: true } },
        endereco: true,
      },
    });
  }

  async updateStatus(id: string, status: StatusPedido) {
    return prisma.pedido.update({
      where: { id },
      data: { status },
    });
  }
}