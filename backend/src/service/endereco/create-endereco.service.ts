import { EnderecoRepository } from "../../repositories/endereco.repository.js";
import { UsuarioRepository } from "../../repositories/usuario.repository.js";

interface EnderecoDTO{
    usuarioId:string
    rua:string,
    bairro:string,
    cidade:string,
    numeroDaCasa: string
}

export class CreateEnderecoServiceService{
    private enderecoRepository = new EnderecoRepository()
    private usuarioRepository = new UsuarioRepository()

    async executar(data: EnderecoDTO){
        const usuarioExiste = await this.usuarioRepository.findById(data.usuarioId)


        if(!usuarioExiste){
            throw new Error("Usuário não encontrado");
        }

        return this.enderecoRepository.create(data)
    }


}