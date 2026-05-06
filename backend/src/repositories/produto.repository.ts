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

  // produto.repository.ts

  // produto.repository.ts

  async update(
    id: number,
    data: {
      nome?: string;
      preco?: number;
      descricao?: string;
      estoque?: number;
      imagemUrl?: string | null;
      tempoProducao?: number;
      ingredientes?: { ingredienteId: number; quantidade: number }[];
    },
  ) {
    return prisma.produto.update({
      where: { id: Number(id) },
      data: {
        nome: data.nome,
        preco: data.preco,
        descricao: data.descricao,
        estoque: data.estoque,
        imagemUrl: data.imagemUrl,
        tempoProducao: data.tempoProducao,
        ingredientes:
          data.ingredientes !== undefined
            ? {
                deleteMany: { produtoId: Number(id) },
                create: data.ingredientes.map((i) => ({
                  ingredienteId: Number(i.ingredienteId),
                  quantidade: Number(i.quantidade),
                })),
              }
            : undefined,
      },
      include: {
        ingredientes: {
          include: { ingrediente: true },
        },
      },
    });
  }

  async delete(id: number) {
    return prisma.produto.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
