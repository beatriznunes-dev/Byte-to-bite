/*
  Warnings:

  - You are about to drop the `Ingredientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IngredientesToProduto` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('EM_PREPARO', 'A_CAMINHO', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPagamento" AS ENUM ('PIX', 'CARTAO', 'DINHEIRO');

-- DropForeignKey
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_userId_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientesToProduto" DROP CONSTRAINT "_IngredientesToProduto_A_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientesToProduto" DROP CONSTRAINT "_IngredientesToProduto_B_fkey";

-- DropTable
DROP TABLE "Ingredientes";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_IngredientesToProduto";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingrediente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "estoque" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enderecoId" INTEGER NOT NULL,
    "precoTotal" DECIMAL(65,30) NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'EM_PREPARO',
    "pagamento" "MetodoPagamento" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" SERIAL NOT NULL,
    "pedioId" TEXT NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "precoDaUnidade" DECIMAL(65,30) NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IngredienteToProduto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IngredienteToProduto_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "_IngredienteToProduto_B_index" ON "_IngredienteToProduto"("B");

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedioId_fkey" FOREIGN KEY ("pedioId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredienteToProduto" ADD CONSTRAINT "_IngredienteToProduto_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingrediente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredienteToProduto" ADD CONSTRAINT "_IngredienteToProduto_B_fkey" FOREIGN KEY ("B") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
