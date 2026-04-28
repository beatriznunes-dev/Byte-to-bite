import type { FastifyInstance } from "fastify";
import { AdminController } from "../controllers/adminController/admin.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";

const controller = new AdminController();

export async function adminRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/admin/usuarios",
    { preHandler: adminMiddleware },
    async (request, reply) => controller.listaUsuario(reply)
  );

  app.patch(
    "/admin/usuarios/:usuarioId/role",
    { preHandler: adminMiddleware },
    controller.changeRole.bind(controller)
  );
}
