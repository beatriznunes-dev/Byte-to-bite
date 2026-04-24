import { UsuarioRepository } from "../../repositories/usuario.repository.js";

interface UpdateUsuarioDTO{
    usuarioId: string,
    nome?: string,
    email?: string
    telefone?: string
}

export class UpdateUsuarioService{
    private usuariorRepository = new UsuarioRepository()


    async executar(data:UpdateUsuarioDTO){
        return this.usuariorRepository.update(data.usuarioId, {
            nome: data.nome,
            email: data.email,
            telefone: data.telefone
        })
    }
}