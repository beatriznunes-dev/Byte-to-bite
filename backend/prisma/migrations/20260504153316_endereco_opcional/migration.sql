-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_enderecoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "enderecoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;
