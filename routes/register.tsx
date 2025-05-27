import { Handlers, PageProps } from "$fresh/server.ts";
import client from "../utils/db.ts";
import { hash } from "@felix/bcrypt";

interface Data {
  msg?: string;
  error?: string;
}

export const handler: Handlers<Data> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const name = form.get("name")?.toString();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!name || !email || !password) {
      return ctx.render({ error: "Preencha todos os campos." });
    }

    try {
      // 🔐 Gerar hash da senha
      const hashedPassword = await hash(password);

      // Salvar no banco com a senha criptografada
      await client.queryObject(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        [name, email, password],
      );

      return ctx.render({ msg: "Cadastro realizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      let errorMessage = "Erro interno no servidor.";
      if (String(error).includes("duplicate key")) {
        errorMessage = "Este e-mail já está cadastrado.";
      }
      return ctx.render({ error: errorMessage });
    }
  },

  GET(_, ctx) {
    return ctx.render({});
  },
};

export default function Register({ data }: PageProps<Data>) {
  return (
    <>
      <link rel="stylesheet" href="/style.css" />
      <div class="container-cadastro">
        <div class="cadastro">
          <h1>Cadastro</h1>

          {data?.msg && (
            <div class="alert-success">
              ✅ {data.msg}
            </div>
          )}
          {data?.error && (
            <div class="alert-error">
              ❌ {data.error}
            </div>
          )}

          <form method="POST" action="/register">
            <div class="title-button">
              <label>
                Nome:
                <input name="name" type="text" required />
              </label>
            </div>

            <div class="title-button">
              <label>
                E-mail:
                <input name="email" type="email" required />
              </label>
            </div>

            <div class="title-button">
              <label>
                Senha:
                <input name="password" type="password" required />
              </label>
            </div>

            <button class="button-cadastrar" type="submit">
              Cadastrar
            </button>
          </form>

          <div class="buttons-nav">
            <a href="/" class="button-voltar">⬅️ Voltar</a>
            <a href="/login" class="button-login">🔐 Ir para Login</a>
          </div>
        </div>
      </div>

      <style>
        {`
          .alert-success {
            background: #d4edda;
            color: #155724;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
          }
          .alert-error {
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
          }
          .buttons-nav {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
          }
          .button-voltar, .button-login {
            background-color: #007BFF;
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
          }
          .button-voltar:hover, .button-login:hover {
            background-color: #0056b3;
          }
        `}
      </style>
    </>
  );
}
