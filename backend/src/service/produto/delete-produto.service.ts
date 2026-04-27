import { ProdutoRepository } from "../../repositories/produto.repository.js";

export class DeleteProdutoService {
  private produtoRepository = new ProdutoRepository();

  async executar(id: number) {
    const produto = await this.produtoRepository.findById(id);

    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    return this.produtoRepository.delete(id);
  }
}