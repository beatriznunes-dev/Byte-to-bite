import { IngredienteRepository } from "../../repositories/ingrediente.repository.js";

interface CreateIngredienteDTO{
    nome: string,
    estoque: number
}

export class CreateIngrediente {
    private ingredienteRepository = new IngredienteRepository()

    async executar(data: CreateIngredienteDTO){
        return this.ingredienteRepository.create(data)
    }
}