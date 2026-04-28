import type { FastifyRequest, FastifyReply } from "fastify";
import type { FastifyError } from "fastify";

export function errorMiddleware(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  request.log.error(error);

  if (error instanceof Error && !(error as FastifyError).statusCode) {
    const businessErrors: Record<string, number> = {
      "Email já cadastrado": 409,
      "Email ou senha inválidos": 401,
      "Usuário não encontrado": 404,
      "Produto não encontrado": 404,
      "Ingrediente não encontrado": 404,
      "Pedido não encontrado": 404,
      "Endereço não encontrado": 404,
      "Acesso negado": 403,
      "Estoque insuficiente": 422,
    };

    for (const [msg, status] of Object.entries(businessErrors)) {
      if (error.message.includes(msg)) {
        reply.status(status).send({ error: error.message });
        return;
      }
    }

    reply.status(400).send({ error: error.message });
    return;
  }

  if ((error as FastifyError).statusCode === 400) {
    reply.status(400).send({
      error: "Dados inválidos",
      details: error.message,
    });
    return;
  }

  if ((error as FastifyError).statusCode) {
    reply
      .status((error as FastifyError).statusCode as number)
      .send({ error: error.message });
    return;
  }

  reply.status(500).send({ error: "Erro interno do servidor" });
}
