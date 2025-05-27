import { hash } from "@felix/bcrypt";

const senha = "123456";

const hashSenha = await hash(senha);

console.log("Hash da senha:", hashSenha);
