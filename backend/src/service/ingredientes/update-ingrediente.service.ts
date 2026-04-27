import { IngredienteRepository } from "../../repositories/ingrediente.repository.js";


interface UpdateIngredienteDTO{
    nome?: string,
    estoque?: number
}

export class UpdateIngrediente{
    private ingredienteRepository = new IngredienteRepository()

    async executar(id: number, data:UpdateIngredienteDTO){
        const ingrediente = await this.ingredienteRepository.findById(id)

        if(!ingrediente){
            throw new Error ("Ingrediente não encontrado")
        }

        return this.ingredienteRepository.update(id, data)
    }
}