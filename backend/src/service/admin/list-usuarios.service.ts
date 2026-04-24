import { UsuarioRepository } from "../../repositories/usuario.repository.js";


export class ListAdminService{
    private usuarioRepository = new UsuarioRepository()


    async executar(){
        return this.usuarioRepository.getAll()
    }
}