import { Handlers, PageProps } from "$fresh/server.ts";
import Client from "../utils/db.ts";
import { verify } from "@felix/bcrypt";

interface Data {
  error?: string;
}

export const handler: Handlers<Data> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email")?.toString() || "";
    const senha = form.get("senha")?.toString() || "";

    // Busca usuário pelo email
    const result = await Client.queryObject<{
      id: number;
      nome: string;
      email: string;
      password: string;
    }>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    const user = result.rows[0];

    // Verifica se encontrou o usuário e se a senha confere
    const senhaCorreta = user ? await verify(senha, user.senha_hash) : false;

    if (!user || !senhaCorreta) {
      return ctx.render({ error: "Email ou senha inválidos" });
    }

    // ⚠️ Sessão simples usando cookie (melhor usar JWT em produção)
    const headers = new Headers();
    headers.set("Set-Cookie", `usuario=${user.nome}; HttpOnly; Path=/`);

    return new Response("", {
      status: 303,
      headers: {
        ...headers,
        Location: "https://www.youtube.com/watch?v=-x1kn0-HIO8", // Redireciona para home
      },
    });
  },

  GET(_, ctx) {
    return ctx.render({});
  },
};

export default function LoginPage({ data }: PageProps<Data>) {
  return (
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 class="text-3xl mb-4">Login</h1>
      <form method="POST" class="flex flex-col gap-4 bg-white p-6 rounded shadow-md">
        <input
          type="email"
          name="email"
          placeholder="Email"
          class="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          class="border p-2 rounded"
          required
        />
        {data?.error && (
          <p class="text-red-500">{data.error}</p>
        )}
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}