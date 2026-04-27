import { ProdutoRepository } from "../../repositories/produto.repository.js";
import { IngredienteRepository } from "../../repositories/ingrediente.repository.js";

interface CreateProdutoDTO {
  nome: string;
  descricao: string;
  preco: number;
  promocao?: number;
  estoque: number;
  imagemUrl?: string;
  tempoProducao: number;
  ingredientes: { ingredienteId: number; quantidade: number }[];
}

export class CreateProdutoService {
  private produtoRepository = new ProdutoRepository();
  private ingredienteRepository = new IngredienteRepository();

  async executar(data: CreateProdutoDTO) {
    for (const item of data.ingredientes) {
      const ingrediente = await this.ingredienteRepository.findById(item.ingredienteId);

      if (!ingrediente) {
        throw new Error(`Ingrediente ${item.ingredienteId} não encontrado`);
      }
    }

    return this.produtoRepository.create(data);
  }
}