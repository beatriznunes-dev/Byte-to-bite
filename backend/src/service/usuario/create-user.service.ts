import { UsuarioRepository } from "../../repositories/usuario.repository.js";
import { hash } from "bcryptjs";
import { Role } from "../../generated/prisma/client.js";

interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  telefone?: string | undefined
}

export class CreateUsuarioService {
  private userRepository = new UsuarioRepository();

  async executar(data: CreateUsuarioDTO) {
    const usuarioExiste = await this.userRepository.findByEmail(data.email);

    if (usuarioExiste) {
      throw new Error("Email já cadastrado");
    }

    const hashSenha = await hash(data.senha, 12);

    const usuario = await this.userRepository.create({
      nome: data.nome,
      email:data.email,
      senha:hashSenha,
      role: Role.USUARIO,
      ...(data.telefone && {telefone: data.telefone})
    })

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }
  }
}
