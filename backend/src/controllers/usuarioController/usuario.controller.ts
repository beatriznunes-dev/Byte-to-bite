import type {FastifyRequest, FastifyReply} from "fastify"
import { CreateUsuarioService } from "../../service/usuario/create-user.service.js"
import { GetUsuarioService } from "../../service/usuario/get-user.service.js"
import { UpdateUsuarioService } from "../../service/usuario/update-user.service.js"
import { DeleteUsuarioService } from "../../service/usuario/delete-user.service.js"

export class UsuarioController{
    async create(request: FastifyRequest, reply: FastifyReply) {
    const { nome, email, senha, telefone, role } = request.body as {
      nome: string;
      email: string;
      senha: string;
      telefone?: string;
      role: "USUARIO" | "ENTREGADOR"; 
    };

    const service = new CreateUsuarioService();
    const usuario = await service.executar({ nome, email, senha, ...(telefone && { telefone }), role });

    return reply.status(201).send(usuario);
  }

    async get(request:FastifyRequest, reply:FastifyReply){
        const {id} = request.params as {id: string}

        const serviceGet = new GetUsuarioService()
        const usuario = await serviceGet.executar(id)

        return reply.status(200).send(usuario)
    }

    async update(request:FastifyRequest, reply:FastifyReply){
        const {id} = request.params as {id: string}
        const data = request.body as {
            nome?: string,
            email?: string,
            telefone?: string
        }
        
        const serviceUpdate = new UpdateUsuarioService()
        const usuario = await serviceUpdate.executar({
            usuarioId: id,
            ...data
        })

        return reply.status(200).send(usuario)
    }

    async delete(request:FastifyRequest, reply:FastifyReply){
        const{id} = request.params as {id: string}

        const servicedelete = new DeleteUsuarioService()
        await servicedelete.executar(id)

        return reply.status(204).send()
    }
}