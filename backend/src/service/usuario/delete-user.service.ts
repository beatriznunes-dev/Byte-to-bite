import { UsuarioRepository } from "../../repositories/usuario.repository.js";


export class DeleteUsuarioService{
    private usuariorRepository = new UsuarioRepository()

    async executar(usuarioId: string){
        await this.usuariorRepository.update(usuarioId, {
            deleteAt: new Date()
        })
    }


}