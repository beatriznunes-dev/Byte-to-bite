import { UsuarioRepository } from "../../repositories/usuario.repository.js";
import { Role } from "../../generated/prisma/client.js";

export class ChangeRoleService{
    private usuarioRepositoy = new UsuarioRepository()

    async executar(adminId:string, usuarioId:string, novaRole: Role){
        const admin = await this.usuarioRepositoy.findById(adminId)

        if(!admin){
        throw new Error("Admin não econtrado")
        }

        if(adminId === usuarioId){
            throw new Error("Admin não pode alterar a própria role")
        }

        const usuario = await this.usuarioRepositoy.findById(usuarioId)

        if(!usuarioId){
            throw new Error("Usuário não encontrado")
        }

        if(!Object.values(Role).includes(novaRole)){
            throw new Error ("Role inválida")
        }

        return this.usuarioRepositoy.update(usuarioId, {role: novaRole})
    }
}