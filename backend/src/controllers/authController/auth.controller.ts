import type { FastifyRequest, FastifyReply } from "fastify";
import { LoginService } from "../../service/auth/login.service.js";

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, senha } = request.body as {
      email: string;
      senha: string;
    };

    const service = new LoginService();
    const result = await service.executar({ email, senha });

    return reply.status(200).send(result);
  }
}