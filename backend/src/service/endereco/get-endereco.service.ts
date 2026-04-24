import { EnderecoRepository } from "../../repositories/endereco.repository.js";
import { UsuarioRepository } from "../../repositories/usuario.repository.js";

export class GetEndereco{
    private enderecoRepository = new EnderecoRepository()
    private usuarioRepository = new UsuarioRepository()

    async executar(usuarioId: string){
        const usuarioExiste = await this.usuarioRepository.findById(usuarioId);

        if(!usuarioExiste){
            throw new Error("Usuário não encontrado")
        }

        return this.enderecoRepository.findByUsuarioId(usuarioId)
    }
}