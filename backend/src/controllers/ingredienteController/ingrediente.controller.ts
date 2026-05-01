import type { FastifyReply, FastifyRequest } from "fastify";
import { CreateIngrediente, GetIngrediente, DeleteIngredienteService, UpdateIngrediente } from "../../service/ingredientes/index.js";
import { IngredienteRepository } from "../../repositories/ingrediente.repository.js";

export class IngredienteController {
    private repository = new IngredienteRepository();

    
    async list(request: FastifyRequest, reply: FastifyReply) {
        try {
            const ingredientes = await this.repository.findAll();
            return reply.status(200).send(ingredientes);
        } catch (error) {
            return reply.status(500).send({ error: "Erro ao listar ingredientes" });
        }
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { nome, estoque } = request.body as {
            nome: string,
            estoque: number
        }

        const serviceCreate = new CreateIngrediente();
        const ingrediente = await serviceCreate.executar({ nome, estoque });

        return reply.status(201).send(ingrediente);
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const data = request.body as { nome?: string, estoque?: number };

        const serviceUpdate = new UpdateIngrediente();
        
        const ingredienteAtualizado = await serviceUpdate.executar(Number(id), data);

        return reply.status(200).send(ingredienteAtualizado);
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };

        const serviceDelete = new DeleteIngredienteService();
        await serviceDelete.executar(Number(id));

        return reply.status(204).send();
    }
}