import { UsuarioRepository } from "../../repositories/usuario.repository.js";

export class GetUserService {
    private usuarioRepository = new UsuarioRepository();

    async executar(usuarioId: string){
        const usuario = await this.usuarioRepository.findById(usuarioId);


        if(!usuario){
            throw new Error ("Usuário não encontrado");
        }

        return usuario;
    }
}