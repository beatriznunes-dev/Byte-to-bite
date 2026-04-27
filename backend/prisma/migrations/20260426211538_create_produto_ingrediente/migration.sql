/*
  Warnings:

  - You are about to drop the `_IngredienteToProduto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_IngredienteToProduto" DROP CONSTRAINT "_IngredienteToProduto_A_fkey";

-- DropForeignKey
ALTER TABLE "_IngredienteToProduto" DROP CONSTRAINT "_IngredienteToProduto_B_fkey";

-- DropTable
DROP TABLE "_IngredienteToProduto";

-- CreateTable
CREATE TABLE "ProdutoIngrediente" (
    "produtoId" INTEGER NOT NULL,
    "ingredienteId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "ProdutoIngrediente_pkey" PRIMARY KEY ("produtoId","ingredienteId")
);

-- AddForeignKey
ALTER TABLE "ProdutoIngrediente" ADD CONSTRAINT "ProdutoIngrediente_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoIngrediente" ADD CONSTRAINT "ProdutoIngrediente_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "Ingrediente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
