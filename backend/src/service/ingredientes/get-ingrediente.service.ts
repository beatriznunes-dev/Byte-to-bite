import { IngredienteRepository } from "../../repositories/ingrediente.repository.js";

export class GetIngrediente{
    private ingredienteRepository = new IngredienteRepository()

    async executar(){
        return this.ingredienteRepository.findAll()
    }
}