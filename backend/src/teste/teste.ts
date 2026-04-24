import { CreateUsuarioService } from "../service/usuario/create-user.service.js";

async function main() {
  const service = new CreateUsuarioService();

  const user = await service.executar({
    nome: "Teste",
    email: "teste@email.com",
    senha: "123456",
    telefone: "10101010",
  });

  console.log("RESULTADO:", user);
}

main();

