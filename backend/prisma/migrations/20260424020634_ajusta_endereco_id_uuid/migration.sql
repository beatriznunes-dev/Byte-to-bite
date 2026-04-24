/*
  Warnings:

  - The primary key for the `Endereco` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ResetSenha` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `ResetSenha` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_userId_fkey";

-- DropForeignKey
ALTER TABLE "ResetSenha" DROP CONSTRAINT "ResetSenha_userId_fkey";

-- AlterTable
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Endereco_id_seq";

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "userId",
ADD COLUMN     "usuarioId" TEXT NOT NULL,
ALTER COLUMN "enderecoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ResetSenha" DROP COLUMN "userId",
ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ResetSenha" ADD CONSTRAINT "ResetSenha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
