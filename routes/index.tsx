// routes/index.tsx
import { Head } from "$fresh/runtime.ts";

// Componente da página padrão para a rota
export default function Home() {
  return (
    <>
      {/* O <Head> é para o conteúdo da tag <head> do HTML, como o título da página e links CSS */}
      <Head>
        <title>Bem-vindo ao Meu Site</title>
        {/* Link para o seu arquivo CSS. Certifique-se de que 'style.css' esteja na pasta 'static/' */}
        <link rel="stylesheet" href="styleshome.css"/>
      </Head>

      {/* Estrutura do corpo da página */}
      <div class="container-home">
        <div class="welcome-box">
          <h1>Bem-vindo!</h1>
          <p>Escolha uma opção para continuar:</p>
          <div class="button-group">
            {/* Botão para a página de Login */}
            <a href="/login" class="button primary">
              Login
            </a>
            {/* Botão para a página de Cadastro */}
            <a href="/register" class="button secondary">
              Cadastro
            </a>
          </div>
        </div>
      </div>
    </>
  );
}