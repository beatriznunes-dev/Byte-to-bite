import {prisma} from "../lib/prisma.js"
import { Role } from "../generated/prisma/client.js"

export class UsuarioRepository {
    async findByEmail(email:string) {
        return await prisma.usuario.findUnique({
            where:{email}
        })
    }

    async findById(id:string){
        return prisma.usuario.findUnique({
            where: {id},
            include:{enderecos:true},
        })
    }

    async getAll(){
        return prisma.usuario.findMany()
    }

    async create (data:{
        nome:string,
        email:string,
        senha:string,
        telefone?: string,
        role: Role
    }){
        return prisma.usuario.create({data})
    }

    async update (id: string, data:any){
        return prisma.usuario.update({
            where: {id},
            data,
        })
    }

};