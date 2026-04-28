import { prisma } from "../lib/prisma.js";
import { hash } from "bcryptjs";
import { Role } from "../generated/prisma/enums.js";

async function seed() {
  const adminExiste = await prisma.usuario.findFirst({
    where: { role: Role.ADMIN },
  });

  if (adminExiste) {
    console.log("Admin já existe!");
    return;
  }

  const senha = await hash("admin123", 12);

  const admin = await prisma.usuario.create({
    data: {
      nome: "Admin",
      email: "admin@bytebite.com",
      senha,
      role: Role.ADMIN,
    },
  });

  console.log("Admin criado:", admin);
}

seed();