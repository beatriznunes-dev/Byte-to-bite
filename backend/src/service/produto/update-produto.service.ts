import { ProdutoRepository } from "../../repositories/produto.repository.js";

interface UpdateProdutoDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  promocao?: number;
  estoque?: number;
  imagemUrl?: string;
  tempoProducao?: number;
  ingredientes?: { ingredienteId: number; quantidade: number }[];
}

export class UpdateProdutoService {
  private produtoRepository = new ProdutoRepository();

  async executar(id: number, data: UpdateProdutoDTO) {
    const produto = await this.produtoRepository.findById(id);

    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    return this.produtoRepository.update(id, data);
  }
}