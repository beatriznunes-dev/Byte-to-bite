import { ProdutoRepository } from "../../repositories/produto.repository.js";

export class GetProdutoService {
  private produtoRepository = new ProdutoRepository();

  async executar(id?: number) {
    if (id) {
      const produto = await this.produtoRepository.findById(id);

      if (!produto) {
        throw new Error("Produto não encontrado");
      }

      return produto;
    }

    return this.produtoRepository.findAll();
  }
}
