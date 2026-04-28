import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return reply.status(401).send({ error: "Token inválido" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    request.user = {
      id: decoded.sub,
      role: decoded.role,
    };
  } catch {
    return reply.status(401).send({ error: "Token inválido ou expirado" });
  }
}

export async function adminMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await authMiddleware(request, reply);

  if (request.user?.role !== "ADMIN") {
    return reply
      .status(403)
      .send({ error: "Acesso negado: requer permissão de ADMIN" });
  }
}
