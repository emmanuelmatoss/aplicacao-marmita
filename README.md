# API do Projeto Marmitas Felizes :kitchen_knife: :stew:

Backend da API RESTful para o sistema "Marmitas da Thaithai", uma plataforma de gerenciamento de pedidos e cardápios semanais de marmitas, com foco inicial em atender funcionários de construtoras.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## :dart: Objetivo do Projeto

Este projeto foi desenvolvido como uma iniciativa de aprendizado e construção de portfólio no curso de Análise e Desenvolvimento de Sistemas. O objetivo principal é criar uma solução funcional para automatizar e otimizar o processo de pedidos para um pequeno negócio de marmitas, além de solidificar conhecimentos em desenvolvimento de aplicações.

## :sparkles: Funcionalidades Principais (Backend)

### Implementadas:
* [x] Configuração do ambiente de desenvolvimento Node.js.
* [x] Estruturação do projeto com Express.js.
* [x] Integração com banco de dados PostgreSQL usando Prisma ORM.
* [x] Definição do schema do banco de dados e execução de migrações.
* [x] Endpoint para registro de novos usuários (`POST /register`) com criptografia de senha (`bcrypt`).
* [x] Endpoint para login de usuários (`POST /login`) com geração de Token JWT (`jsonwebtoken`).
* [x] Middleware de autenticação (`authMiddleware`) para proteger rotas.
* [x] Rota protegida de exemplo (`GET /profile`) para testar a autenticação.

### Planejadas:
* [ ] CRUD (Criar, Ler, Atualizar, Deletar) completo para Pratos (protegido para Admin).
* [ ] CRUD completo para Empresas (protegido para Admin).
* [ ] Funcionalidade para Admin montar o Cardápio Semanal, selecionando pratos disponíveis.
* [ ] Endpoint para Funcionários visualizarem o Cardápio Semanal ativo.
* [ ] Endpoint para Funcionários logados realizarem seus pedidos da semana.
* [ ] Endpoint para Admin visualizar todos os pedidos de uma semana.
* [ ] Funcionalidade para Admin calcular o total de insumos necessários com base nos pedidos da semana.
* [ ] Endpoint para Admin visualizar os pedidos individuais de cada funcionário.

## :hammer_and_wrench: Tecnologias Utilizadas

* **Node.js:** Ambiente de execução JavaScript no servidor.
* **Express.js:** Framework para construção da API e gerenciamento de rotas.
* **Prisma ORM:** Para interação com o banco de dados de forma moderna e segura.
* **PostgreSQL:** Banco de dados relacional para armazenamento dos dados.
* **JSON Web Tokens (JWT):** Para autenticação e autorização de usuários via `jsonwebtoken`.
* **bcrypt:** Para criptografia segura de senhas.
* **Nodemon:** Para reiniciar o servidor automaticamente durante o desenvolvimento.
* **Insomnia/Postman:** Para testes dos endpoints da API.
* **Git & GitHub:** Para controle de versão e backup do código.

## :file_folder: Estrutura do Projeto (Backend)

backend/
├── prisma/
│   ├── schema.prisma      # Definição dos modelos e conexão com BD
│   └── migrations/        # Histórico de migrações do BD
├── src/
│   ├── middlewares/
│   │   └── authMiddleware.js # Middleware de autenticação
│   └── server.js          # Arquivo principal do servidor Express
├── .env                   # Variáveis de ambiente (NÃO versionar se público)
├── .gitignore             # Arquivos ignorados pelo Git
├── package.json           # Metadados do projeto e dependências
└── package-lock.json      # Lockfile das dependências

## :rocket: Como Rodar o Projeto Localmente (Backend)

Siga os passos abaixo para configurar e rodar o backend localmente:

1.  **Clone o repositório (substitua pela URL do seu repositório):**
    ```bash
    git clone https://github.com/emmanuelmatoss/aplicacao-marmita.git
    cd aplicacao-marmita/backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env` dentro da pasta `backend`.
    * Copie o conteúdo abaixo para o seu `.env` e substitua pelos seus dados:
        ```env
        DATABASE_URL="postgresql://postgres:[SUA_SENHA_DO_POSTGRES]@localhost:5432/marmitas_db"
        JWT_SECRET="[SUA_CHAVE_SECRETA_SUPER_LONGA_E_COMPLEXA_PARA_JWT]"
        PORT=3000
        ```

4.  **Configure o Banco de Dados PostgreSQL:**
    * Certifique-se de que o PostgreSQL está instalado e rodando.
    * Crie um banco de dados chamado `marmitas_db` (ou o nome que você especificou na `DATABASE_URL`). Você pode usar o pgAdmin ou DBeaver:
        ```sql
        CREATE DATABASE marmitas_db;
        ```

5.  **Aplique as Migrações do Banco de Dados:**
    ```bash
    npx prisma migrate dev
    ```
    (Confirme a criação da migração se solicitado)

6.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A API estará rodando em `http://localhost:3000` (ou na porta que você definiu no `.env`).

## :electric_plug: Endpoints da API (Implementados)

### Autenticação

#### `POST /register`
Registra um novo usuário.

* **Corpo da Requisição (JSON):**
    ```json
    {
      "name": "Nome do Funcionário",
      "email": "funcionario@empresa.com",
      "password": "senhaSegura123",
      "companyId": "id_da_empresa_existente"
    }
    ```
* **Resposta de Sucesso (201 Created):**
    ```json
    {
      "id": "cko...",
      "name": "Nome do Funcionário",
      "email": "funcionario@empresa.com"
    }
    ```

#### `POST /login`
Autentica um usuário existente e retorna um token JWT.

* **Corpo da Requisição (JSON):**
    ```json
    {
      "email": "funcionario@empresa.com",
      "password": "senhaSegura123"
    }
    ```
* **Resposta de Sucesso (200 OK):**
    ```json
    {
      "message": "Login bem-sucedido!",
      "user": {
        "id": "cko...",
        "name": "Nome do Funcionário",
        "email": "funcionario@empresa.com",
        "role": "FUNCIONARIO"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

#### `GET /profile` (Rota Protegida)
Retorna informações do usuário autenticado. Requer um Token JWT no cabeçalho de Autorização.

* **Cabeçalho (Header):**
    `Authorization: Bearer SEU_TOKEN_JWT_AQUI`
* **Resposta de Sucesso (200 OK):**
    ```json
    {
      "message": "Você está acessando uma rota protegida!",
      "user": {
        "userId": "cko...",
        "role": "FUNCIONARIO",
        "iat": 167...,
        "exp": 167...
      }
    }
    ```

## :construction_worker: Autor

* **EMMANUEL DE MATOS AURÉLIO**
* Email: `emmanuel.matos@gmail.com`
* GitHub: `https://github.com/emmanuelmatoss`
* LinkedIn: `https://www.linkedin.com/in/emmanuelmatoss`

---