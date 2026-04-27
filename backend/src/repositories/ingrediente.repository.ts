import {prisma} from "../lib/prisma.js"



export class IngredienteRepository{
    async create(data:{
        nome:string,
        estoque:number
    }){
        return prisma.ingrediente.create({data})
    }

    async findAll(){
        return prisma.ingrediente.findMany()
    }

    async findById(id:number){
        return prisma.ingrediente.findUnique({where:{id}})
    }

    async update(id: number, data: Partial<{
        nome: string,
        estoque: number
    }>){
        return prisma.ingrediente.update({where: {id}, data})
    }

    async delete(id:number){
        return prisma.ingrediente.delete({where: {id}})
    }
}