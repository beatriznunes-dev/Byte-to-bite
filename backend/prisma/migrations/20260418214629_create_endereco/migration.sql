-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ENTREGADOR', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "telefone" TEXT;

-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "numeroDaCasa" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
