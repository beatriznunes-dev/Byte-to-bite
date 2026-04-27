import { IngredienteRepository } from "../../repositories/ingrediente.repository.js";


export class DeleteIngredienteService{
    private ingredienteRepository = new IngredienteRepository()

    async executar(id: number){
        const ingrediente = await this.ingredienteRepository.findById(id)
        if(!ingrediente){
            throw new Error ("Ingrediente não encontrado")
        }
        return await this.ingredienteRepository.delete(id)
    }
}