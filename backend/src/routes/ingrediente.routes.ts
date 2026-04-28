import type { FastifyInstance } from "fastify";
import { IngredienteController } from "../controllers/ingredienteController/ingrediente.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";

const controller = new IngredienteController();

export async function ingredienteRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/ingredientes",
    { preHandler: adminMiddleware },
    controller.create.bind(controller)
  );

  app.put(
    "/ingredientes/:id",
    { preHandler: adminMiddleware },
    controller.update.bind(controller)
  );

  app.delete(
    "/ingredientes/:id",
    { preHandler: adminMiddleware },
    controller.delete.bind(controller)
  );
}
