import type { FastifyInstance } from "fastify";
import { EnderecoController } from "../controllers/enderecoController/endereco.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const controller = new EnderecoController();

export async function enderecoRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/enderecos",
    { preHandler: authMiddleware },
    controller.create.bind(controller)
  );

  app.get(
    "/enderecos/:usuarioId",
    { preHandler: authMiddleware },
    controller.get.bind(controller)
  );

  app.put(
    "/enderecos/:usuarioId/:enderecoId",
    { preHandler: authMiddleware },
    controller.update.bind(controller)
  );

  app.delete(
    "/enderecos/:usuarioId/:enderecoId",
    { preHandler: authMiddleware },
    controller.delete.bind(controller)
  );
}
