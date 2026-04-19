-- CreateTable
CREATE TABLE "ResetSenha" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResetSenha_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResetSenha" ADD CONSTRAINT "ResetSenha_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
