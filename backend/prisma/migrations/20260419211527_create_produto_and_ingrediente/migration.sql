-- AlterTable
ALTER TABLE "Endereco" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DECIMAL(65,30) NOT NULL,
    "promocao" DECIMAL(65,30),
    "estoque" INTEGER NOT NULL,
    "imagemUrl" TEXT,
    "tempoProducao" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "estoque" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ingredientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IngredientesToProduto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IngredientesToProduto_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_IngredientesToProduto_B_index" ON "_IngredientesToProduto"("B");

-- AddForeignKey
ALTER TABLE "_IngredientesToProduto" ADD CONSTRAINT "_IngredientesToProduto_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientesToProduto" ADD CONSTRAINT "_IngredientesToProduto_B_fkey" FOREIGN KEY ("B") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
