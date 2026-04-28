import type { FastifyInstance } from "fastify";
import { PedidoController } from "../controllers/pedidoController/pedido.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const controller = new PedidoController();

export async function pedidoRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/pedidos",
    { preHandler: authMiddleware },
    controller.create.bind(controller)
  );

  app.get(
    "/pedidos/usuario/:usuarioId",
    { preHandler: authMiddleware },
    controller.getByUsuario.bind(controller)
  );

  app.get(
    "/pedidos",
    { preHandler: adminMiddleware },
    controller.getAll.bind(controller)
  );

  app.patch(
    "/pedidos/:id/status",
    { preHandler: adminMiddleware },
    controller.updateStatus.bind(controller)
  );
}
