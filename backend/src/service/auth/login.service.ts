import { UsuarioRepository } from "../../repositories/usuario.repository.js";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

interface LoginDTO {
  email: string;
  senha: string;
}

export class LoginService {
  private userRepository = new UsuarioRepository();

  async executar({ email, senha }: LoginDTO) {
    const usuario = await this.userRepository.findByEmail(email);

    if (!usuario) {
      throw new Error("Email ou senha inválidos");
    }

    const senhaCorreta = await compare(senha, usuario.senha);

    if (!senhaCorreta) {
      throw new Error("Email ou senha inválidos");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
    }

    const token = jwt.sign(
      { sub: usuario.id, role: usuario.role },
      secret,
      { expiresIn: "7d" }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }
}