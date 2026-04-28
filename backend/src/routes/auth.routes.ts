import type { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/authController/auth.controller.js";

const controller = new AuthController();

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/auth/login", controller.login.bind(controller));
}