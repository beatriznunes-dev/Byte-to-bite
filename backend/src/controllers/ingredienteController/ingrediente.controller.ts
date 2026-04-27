import type {FastifyReply, FastifyRequest} from "fastify"

import { CreateIngrediente, GetIngrediente, DeleteIngredienteService, UpdateIngrediente } from "../../service/ingredientes/index.js"

export class IngredienteController{
    async create(request: FastifyRequest, reply: FastifyReply){
        const { nome, estoque} = request.body as {
            nome: string, 
            estoque: number
        }


        const serviceCreate = new CreateIngrediente()
        const ingrediente = await serviceCreate.executar({nome, estoque})

        return reply.status(201).send({ingrediente})
    }

    async update(request: FastifyRequest, reply: FastifyReply){
        const {id} = request.params as {id:number}
        const data = request.body as {nome?: string, estoque?: number}

        const serviceUpdate = new UpdateIngrediente()
        const ingredienteAtualizado = serviceUpdate.executar(id, data)


        return reply.status(200).send(ingredienteAtualizado)
    }

    async delete (request: FastifyRequest, reply: FastifyReply){
        const {id} = request.params as {
            id: number
        }

        const serviceDelete = new DeleteIngredienteService()
        await serviceDelete.executar(id)

        return reply.status(204).send()
    }
}