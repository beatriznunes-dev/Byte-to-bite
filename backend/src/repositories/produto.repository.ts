import { prisma } from "../lib/prisma.js";

export class ProdutoRepository {
  async create(data: {
    nome: string;
    descricao: string;
    preco: number;
    promocao?: number;
    estoque: number;
    imagemUrl?: string;
    tempoProducao: number;
    ingredientes: { ingredienteId: number; quantidade: number }[];
  }) {
    const { ingredientes, ...produtoData } = data;

    return prisma.produto.create({
      data: {
        ...produtoData,
        ingredientes: {
          create: ingredientes.map((i) => ({
            ingredienteId: i.ingredienteId,
            quantidade: i.quantidade,
          })),
        },
      },
      include: { ingredientes: true },
    });
  }

  async findAll() {
    return prisma.produto.findMany({
      where: { deletedAt: null },
      include: { ingredientes: true },
    });
  }

  async findById(id: number) {
    return prisma.produto.findUnique({
      where: { id },
      include: { ingredientes: true },
    });
  }

  async update(
    id: number,
    data: Partial<{
      nome: string;
      descricao: string;
      preco: number;
      promocao: number;
      estoque: number;
      imagemUrl: string;
      tempoProducao: number;
    }>,
  ) {
    return prisma.produto.update({
      where: { id },
      data,
      include: { ingredientes: true },
    });
  }

  async delete(id: number) {
    return prisma.produto.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
