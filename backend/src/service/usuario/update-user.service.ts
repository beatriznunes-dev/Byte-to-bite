import { UsuarioRepository } from "../../repositories/usuario.repository.js";

interface UpdateUsuarioDTO{
    usuarioId: string,
    nome?: string,
    telefone?: string
}

export class UpdateUsuarioService{
    private usuariorRepository = new UsuarioRepository()


    async excutar(data:UpdateUsuarioDTO){
        return this.usuariorRepository.update(data.usuarioId, {
            nome: data.nome,
            telefone: data.telefone
        })
    }
}