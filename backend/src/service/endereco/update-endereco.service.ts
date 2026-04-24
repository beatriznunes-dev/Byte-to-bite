import { EnderecoRepository } from "../../repositories/endereco.repository.js";
import { UsuarioRepository } from "../../repositories/usuario.repository.js";


interface UpdateDTO{
    rua?: string,
    bairro?: string,
    cidade?: string,
    numeroDaCasa?: string
}


export class UpdateService{
    private enderecoRepository = new EnderecoRepository()
    private usuarioRepository = new UsuarioRepository()


    async executar(usuarioId: string, enderecoId: string, data: UpdateDTO){
        const usuarioExiste = await this.usuarioRepository.findById(usuarioId)

        if(!usuarioExiste){
            throw new Error("Usuário não existe")
        }

        const enderecoExiste = await this.enderecoRepository.findById(enderecoId)

         if(!enderecoExiste){
            throw new Error("Endereço não existe")
        }

        if(enderecoExiste.usuarioId != usuarioId){
            throw new Error("Endereço não pertence ao usuário")
        }


        return this.enderecoRepository.update(enderecoId, data)
    }
}