import type { FastifyReply, FastifyRequest } from "fastify";
import {
  ListAdminService,
  ChangeRoleService,
} from "../../service/admin/index.js";
import type { Role } from "../../generated/prisma/enums.js";

export class AdminController {
  async listaUsuario(reply: FastifyReply) {
    const lista = new ListAdminService();
    const listaUsuario = await lista.executar();

    return reply.status(200).send(listaUsuario);
  }

  async changeRole(request: FastifyRequest, reply: FastifyReply) {
    const { adminId } = request.body as { adminId: string };
    const { usuarioId } = request.params as { usuarioId: string };
    const { role } = request.body as { role: Role };

    const serviceRole = new ChangeRoleService();
    await serviceRole.executar(adminId, usuarioId, role);

    return reply.status(200).send({ message: "Role alterada com sucesso" });
  }
}
