import { ResetSenhaRepository } from "../../repositories/resetSenha.repository.js";
import { UsuarioRepository } from "../../repositories/usuario.repository.js";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export class RequestResetSenhaService {
  private resetSenhaRepository = new ResetSenhaRepository();
  private usuarioRepository = new UsuarioRepository();

  async executar(email: string) {
    const usuario = await this.usuarioRepository.findByEmail(email);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    const codigo = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await this.resetSenhaRepository.create({
      usuarioId: usuario.id,
      codigo,
      expiresAt,
    });

    await resend.emails.send({
      from: "noreply@bytebite.com",
      to: usuario.email,
      subject: "Recuperação de senha",
      html: `<p>Seu código de recuperação é: <strong>${codigo}</strong></p>
             <p>Este código expira em 1 hora.</p>`,
    });

    return { message: "Email de recuperação enviado!" };
  }
}