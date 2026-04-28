import type { FastifyInstance } from "fastify";
import { ProdutoController } from "../controllers/produtoController/protudo.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const controller = new ProdutoController();

export async function produtoRoutes(app: FastifyInstance): Promise<void> {
  app.get("/produtos", controller.getAll.bind(controller));
  app.get("/produtos/:id", controller.getById.bind(controller));

  app.post(
    "/produtos",
    { preHandler: adminMiddleware },
    controller.create.bind(controller)
  );

  app.put(
    "/produtos/:id",
    { preHandler: adminMiddleware },
    controller.update.bind(controller)
  );

  app.delete(
    "/produtos/:id",
    { preHandler: adminMiddleware },
    controller.delete.bind(controller)
  );
}
