import type { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateEnderecoServiceService,
  GetEndereco,
  UpdateService,
  DeleteEnderecoService,
} from "../../service/endereco/index.js";

export class EnderecoController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { usuarioId, rua, bairro, cidade, numeroDaCasa } = request.body as {
      usuarioId: string;
      rua: string;
      bairro: string;
      cidade: string;
      numeroDaCasa: string;
    };

    const createEndereco = new CreateEnderecoServiceService();
    const endereco = await createEndereco.executar({
      usuarioId,
      rua,
      bairro,
      cidade,
      numeroDaCasa,
    });

    return reply.status(201).send(endereco);
  }

  async get(request: FastifyRequest, reply: FastifyReply) {
    const { usuarioId } = request.params as { usuarioId: string };

    const getEndereco = new GetEndereco();
    const endereco = await getEndereco.executar(usuarioId);

    return reply.status(200).send(endereco);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { usuarioId, enderecoId } = request.params as {
      usuarioId: string;
      enderecoId: string;
    };

    const data = request.body as {
      rua?: string;
      bairro?: string;
      cidade?: string;
      numeroDaCasa?: string;
    };


    const update = new UpdateService();
    const endereco = await update.executar(usuarioId, enderecoId, data)

    return reply.status(200).send(endereco)
  }

  async delete(request: FastifyRequest, reply: FastifyReply){
    const {usuarioId, enderecoId} = request.params as { usuarioId: string, enderecoId: string}
    
    const deleteEndereco = new DeleteEnderecoService()
    await deleteEndereco.executar(usuarioId, enderecoId)

    return reply.status(204).send()
  }

}
