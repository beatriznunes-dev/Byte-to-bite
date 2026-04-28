import type { FastifyInstance } from "fastify";
import { UsuarioController } from "../controllers/usuarioController/usuario.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const controller = new UsuarioController();

export async function usuarioRoutes(app: FastifyInstance): Promise<void> {

  app.post("/usuarios", controller.create.bind(controller));


  app.get(
    "/usuarios/:id",
    { preHandler: authMiddleware },
    controller.get.bind(controller)
  );

  app.put(
    "/usuarios/:id",
    { preHandler: authMiddleware },
    controller.update.bind(controller)
  );

  app.delete(
    "/usuarios/:id",
    { preHandler: authMiddleware },
    controller.delete.bind(controller)
  );
}
