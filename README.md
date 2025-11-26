# 🃏 Gerador de Piadas (Fullstack)

Uma aplicação web **Fullstack** desenvolvida para buscar, cadastrar e gerenciar piadas. O projeto utiliza uma arquitetura moderna separando Frontend (React) e Backend (Express), com persistência de dados em MongoDB.

Este projeto foi desenvolvido como evolução da disciplina de **Programação Web Fullstack**, transformando uma SPA simples em um sistema completo com autenticação, segurança e banco de dados.

### ✨ Funcionalidades

* **🔐 Autenticação e Cadastro:** Sistema completo de Login e Registro de usuários utilizando **JWT (JSON Web Tokens)** e criptografia de senhas.
* **🗄️ Banco de Dados Próprio:** Persistência de usuários e piadas em um banco de dados **MongoDB**.
* **🔎 Busca Híbrida Inteligente (Fallback):**
    * O sistema prioriza a busca de piadas no banco de dados local.
    * Caso não encontre (e o idioma seja Português), busca automaticamente na API externa [JokeAPI](https://v2.jokeapi.dev/) como contingência.
* **➕ Cadastro de Piadas:** Usuários logados podem contribuir cadastrando novas piadas no sistema.
* **🛡️ Segurança Reforçada:**
    * **Sanitização:** Proteção contra NoSQL Injection.
    * **Rate Limiting:** Proteção contra ataques de força bruta (brute-force) no login.
    * **Helmet:** Configuração de headers HTTP seguros.
* **🚀 Performance:** Compressão Gzip nas respostas da API e logs de requisições.


### 🛠️ Tecnologias Utilizadas

**Frontend:**
* **[React.js](https://reactjs.org/):** Biblioteca para construção da interface de usuário.
* **[Material-UI (MUI)](https://mui.com/):** Biblioteca de componentes para design responsivo.

**Backend:**
* **[Node.js](https://nodejs.org/) & [Express](https://expressjs.com/):** Servidor e API RESTful.
* **[MongoDB](https://www.mongodb.com/):** Banco de dados NoSQL.
* **Segurança & Autenticação:** `jsonwebtoken` (JWT), `bcryptjs`, `helmet`, `express-rate-limit`, `express-mongo-sanitize`.
* **Ferramentas:** `morgan` (logs), `compression` (otimização), `cors`.

### 🚀 Como Executar o Projeto

Como este é um projeto Fullstack, é necessário configurar e rodar o Backend e o Frontend simultaneamente.

#### Pré-requisitos
* Node.js instalado.
* Uma string de conexão com o MongoDB (Atlas ou local).

#### 1. Clone o repositório
```bash
git clone [https://github.com/seu-usuario/gerador-de-piadas.git](https://github.com/seu-usuario/gerador-de-piadas.git)
cd jokesgenerate
````

#### 2\. Configurando o Backend (Servidor)

1.  Acesse a pasta do backend:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:
    ```env
    DATABASE_URL="sua_string_de_conexao_mongodb_aqui"
    JWT_SECRET="crie_uma_senha_secreta_para_o_token"
    PORT=3001
    ```
4. Configuração de Segurança (HTTPS):
    Para habilitar o HTTPS local, é necessário gerar os certificados autoassinados.
    Dentro da pasta backend/src, execute o comando (Git Bash/Linux):

    ```bash
    openssl req -nodes -new -x509 -keyout server.key -out server.cert
    ```
    (Pressione Enter para todas as perguntas).

    Inicie o servidor:

    ``bash
    npm start
    ```
    O servidor iniciará seguro em https://localhost:3001

5. Configurando o Frontend (Interface)

#### 3\. Configurando o Frontend (Interface)

1.  Abra um **novo terminal** e acesse a pasta do frontend:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação React:
    ```bash
    npm start
    ```
    *A aplicação abrirá automaticamente no seu navegador em `http://localhost:3000`*


### 🧪 Testando a Aplicação

Para testar rapidamente, você pode criar uma nova conta clicando em "Não tem uma conta? Cadastre-se" na tela de login!

### 👩‍💻 Desenvolvido por

Feito por **Brenda Beatriz Cristaldo** ❤️ 

[](https://www.linkedin.com/in/brenda-cristaldo/)
[](https://github.com/brendacristaldo/)
