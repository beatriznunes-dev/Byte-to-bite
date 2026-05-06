import type { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateProdutoService,
  GetProdutoService,
  UpdateProdutoService,
  DeleteProdutoService,
} from "../../service/produto/index.js";

export class ProdutoController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const {
      nome,
      descricao,
      preco,
      promocao,
      estoque,
      imagemUrl,
      tempoProducao,
      ingredientes,
    } = request.body as {
      nome: string;
      descricao: string;
      preco: number;
      promocao?: number;
      estoque: number;
      imagemUrl?: string;
      tempoProducao: number;
      ingredientes: { ingredienteId: number; quantidade: number }[];
    };

    const service = new CreateProdutoService();
    const produto = await service.executar({
      nome,
      descricao,
      preco,
      estoque,
      tempoProducao,
      ingredientes,
      ...(promocao && { promocao }),
      ...(imagemUrl && { imagemUrl }),
    });

    return reply.status(201).send(produto);
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const service = new GetProdutoService();
    const produtos = await service.executar();

    return reply.status(200).send(produtos);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    const service = new GetProdutoService();
    const produto = await service.executar(Number(id));

    return reply.status(200).send(produto);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const data = request.body as {
      nome?: string;
      descricao?: string;
      preco?: number;
      promocao?: number;
      estoque?: number;
      imagemUrl?: string;
      tempoProducao?: number;
      ingredientes?: { ingredienteId: number; quantidade: number }[];
    };

    const service = new UpdateProdutoService();
    const produto = await service.executar(Number(id), data);

    return reply.status(200).send(produto);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    const service = new DeleteProdutoService();
    await service.executar(Number(id));

    return reply.status(204).send();
  }
}
