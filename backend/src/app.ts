import Fastify from "fastify";
import cors from "@fastify/cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import {
  authRoutes,
  usuarioRoutes,
  enderecoRoutes,
  produtoRoutes,
  ingredienteRoutes,
  pedidoRoutes,
  adminRoutes,
} from "./routes/index.js";

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "warn" : "info",
  },
});

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.get("/", async (_request, reply) => {
  return reply.send({ message: "API funcionando", timestamp: new Date().toISOString() });
});

await app.register(authRoutes);
await app.register(usuarioRoutes);
await app.register(enderecoRoutes);
await app.register(produtoRoutes);
await app.register(ingredienteRoutes);
await app.register(pedidoRoutes);
await app.register(adminRoutes);

app.setErrorHandler(errorMiddleware);

export default app;