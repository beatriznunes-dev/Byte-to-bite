import { prisma } from "../lib/prisma.js";


export class EnderecoRepository{
    async create (data:{
        usuarioId: string,
        rua:string,
        bairro: string,
        cidade: string,
        numeroDaCasa: string
    }){
        return prisma.endereco.create({data});
    }

    async findByUsuarioId(usuarioId: string){
        return prisma.endereco.findMany({where: {usuarioId, deletedAt: null}})
    }

    async findById(id: string){
        return prisma.endereco.findUnique({where:{id}})
    }

    async update(id:string, data: Partial<{
        rua:string,
        bairro: string,
        cidade: string,
        numeroDaCasa: string
    }>){
        return prisma.endereco.update({
            where: {id},
            data
        })
    }

    async delete(id: string){
        return prisma.endereco.update({
            where: {id},
            data:{deletedAt: new Date()}
        })
    }


}