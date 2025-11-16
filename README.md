# Gerador de Piadas
Uma Single Page Application (SPA) desenvolvida em React.js para buscar, exibir e filtrar piadas, utilizando a [JokeAPI](https://v2.jokeapi.dev/).

Este projeto foi desenvolvido como o **Projeto 1 da disciplina de Programação Web Fullstack**, com o objetivo de aplicar conceitos de desenvolvimento frontend com React.js, componentização, gerenciamento de estado e consumo de APIs.

---

### Screenshot

![Screenshot do Gerador de Piadas](./screenshot-do-projeto.png)

---

### Funcionalidades

* **Busca por Categorias:** Selecione uma ou mais categorias para filtrar as piadas.
* **Filtro por Idioma:** Receba piadas em Português, Inglês ou Espanhol.
* **Validação de Formulário:** Garante que o usuário selecione ao menos uma categoria antes da busca.
* **Suporte a Múltiplos Formatos:** Exibe corretamente piadas de formato único (`single`) e de duas partes (`setup/delivery`).
* **Feedback de Interface:** Apresenta indicadores visuais para estados de carregamento (`loading`) e erros.
* **Tratamento de Erro Inteligente:** Exibe mensagens de erro específicas, diferenciando falhas de conexão de quando não há piadas disponíveis para os filtros selecionados.

---

### Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

* **[React.js](https://reactjs.org/):** Biblioteca principal para a construção da interface de usuário componentizada.
* **[Material-UI (MUI)](https://mui.com/):** Biblioteca de componentes React para uma estilização consistente e design responsivo.
* **[JokeAPI](https://v2.jokeapi.dev/):** API pública utilizada como fonte para obter as piadas em formato JSON.
* **JavaScript (ES6+):** Linguagem de programação base da aplicação.
* **CSS:** Utilizado através do sistema de estilização do Material-UI.

---

### Como Executar o Projeto

Para rodar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/seu-usuario/gerador-de-piadas.git](https://github.com/seu-usuario/gerador-de-piadas.git)
    ```

2.  **Acesse a pasta do projeto**
    ```bash
    cd jokesgenerate
    ```

3.  **Instale as dependências**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento**
    ```bash
    npm run dev
    ```

5.  **Acesse a aplicação**
    Abra seu navegador e acesse `http://localhost:3000` (ou a porta que o Vite indicar no seu terminal).


---

### 👩‍💻 Desenvolvido por Brenda Beatriz Cristaldo:

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/brenda-cristaldo/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/brendacristaldo/)
