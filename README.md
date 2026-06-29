# 🚗 API Concessionária - Projeto II

API REST desenvolvida para o gerenciamento de uma concessionária de veículos, criada como projeto avaliativo da disciplina de **Programação Web** do Curso Superior de Tecnologia em **Análise e Desenvolvimento de Sistemas (ADS)** do **IFSP - Câmpus Boituva**.

O sistema permite gerenciar **Clientes**, **Vendedores**, **Carros**, **Estoque** e **Notas Fiscais**, seguindo as regras de negócio propostas no enunciado e utilizando persistência em banco de dados **MySQL**.

O projeto foi desenvolvido com arquitetura em camadas, separando responsabilidades entre **Models**, **Repositories**, **Services**, **Controllers** e um arquivo centralizador de rotas.

---

## 🚀 Começando

Estas instruções permitem executar o projeto localmente para testar as funcionalidades da API.

---

## 📋 Pré-requisitos

Para rodar este projeto, é necessário ter instalado:

* Node.js
* npm
* TypeScript
* MySQL
* Postman ou Insomnia para testar as rotas

---

## 🐧 Instalação

**1. Clone o repositório:**

```bash
git clone https://github.com/matheusnakagaki/projeto_concessionaria.git
```

**2. Entre na pasta do projeto:**

```bash
cd projeto_concessionaria
```

**3. Instale as dependências:**

```bash
npm install
```

---

## ⚙️ Configuração do banco de dados

O projeto utiliza MySQL com as configurações definidas em arquivo `.env`.

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mysql
DB_NAME=concessionaria
```

Ajuste o usuário e a senha conforme a configuração do seu MySQL local.

> O arquivo `.env` não deve ser enviado para o GitHub. Apenas o `.env.example` deve ficar no repositório.

---

## ▶️ Como executar

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

URL base da API:

```txt
http://localhost:3000
```

Ao iniciar o servidor, o sistema cria automaticamente o banco e as tabelas necessárias, caso ainda não existam.

---

## 📌 Principais Rotas da API

A API segue os princípios REST, utilizando os métodos `GET`, `POST`, `PUT` e `DELETE`. Todas as requisições e respostas utilizam o formato JSON.

---

### 👤 Clientes — `/clientes`

| Método   | Rota                  | Descrição                                             |
| -------- | --------------------- | ----------------------------------------------------- |
| `GET`    | `/clientes`           | Lista todos os clientes cadastrados                   |
| `GET`    | `/clientes/:id`       | Retorna os dados de um cliente pelo id                |
| `POST`   | `/clientes`           | Cadastra um novo cliente                              |
| `PUT`    | `/clientes/:id`       | Atualiza os dados de um cliente existente             |
| `DELETE` | `/clientes/:id`       | Remove um cliente, desde que não possua notas fiscais |
| `GET`    | `/clientes/notas/:id` | Lista todas as notas fiscais de um cliente            |

Exemplo de corpo para cadastro:

```json
{
  "nome": "João da Silva",
  "cpf": "123.456.789-00",
  "telefone": "(11) 99999-0000",
  "email": "joao@email.com",
  "cidade": "São Paulo"
}
```

---

### 🧑‍💼 Vendedores — `/vendedores`

| Método   | Rota                    | Descrição                                              |
| -------- | ----------------------- | ------------------------------------------------------ |
| `GET`    | `/vendedores`           | Lista todos os vendedores                              |
| `GET`    | `/vendedores/:id`       | Retorna um vendedor pelo id                            |
| `POST`   | `/vendedores`           | Cadastra um novo vendedor                              |
| `PUT`    | `/vendedores/:id`       | Atualiza um vendedor existente                         |
| `DELETE` | `/vendedores/:id`       | Remove um vendedor, desde que não possua notas fiscais |
| `GET`    | `/vendedores/notas/:id` | Lista todas as notas fiscais de um vendedor            |

Exemplo de corpo para cadastro:

```json
{
  "nome": "Ana Souza",
  "matricula": "VND-001",
  "comissao_percentual": 5.5
}
```

---

### 🚘 Carros — `/carros`

| Método   | Rota                  | Descrição                                                                 |
| -------- | --------------------- | ------------------------------------------------------------------------- |
| `GET`    | `/carros`             | Lista todos os carros                                                     |
| `GET`    | `/carros/:id`         | Retorna um carro pelo id                                                  |
| `GET`    | `/carros/disponiveis` | Lista carros com estoque disponível                                       |
| `POST`   | `/carros`             | Cadastra um novo carro                                                    |
| `PUT`    | `/carros/:id`         | Atualiza um carro existente                                               |
| `DELETE` | `/carros/:id`         | Remove um carro, desde que não possua estoque ou notas fiscais vinculadas |

Exemplo de corpo para cadastro:

```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2024,
  "placa": "ABC-1234",
  "preco": 110000.00,
  "cor": "Prata"
}
```

---

### 📦 Estoque — `/estoque`

| Método   | Rota                       | Descrição                                           |
| -------- | -------------------------- | --------------------------------------------------- |
| `GET`    | `/estoque`                 | Lista todos os registros de estoque                 |
| `GET`    | `/estoque/:id`             | Retorna um registro de estoque pelo id              |
| `GET`    | `/estoque/carro/:id_carro` | Retorna o estoque de um carro específico            |
| `POST`   | `/estoque`                 | Cria um novo registro de estoque                    |
| `PUT`    | `/estoque/:id`             | Atualiza quantidade, localização ou data de entrada |
| `DELETE` | `/estoque/:id`             | Remove um registro de estoque                       |

Exemplo de corpo para cadastro:

```json
{
  "id_carro": 1,
  "quantidade": 5,
  "localizacao_patio": "Galpão A-3",
  "data_entrada": "2025-06-01"
}
```

---

### 🧾 Notas Fiscais — `/notas`

| Método   | Rota         | Descrição                                                         |
| -------- | ------------ | ----------------------------------------------------------------- |
| `GET`    | `/notas`     | Lista todas as notas fiscais                                      |
| `GET`    | `/notas/:id` | Retorna uma nota fiscal pelo id                                   |
| `POST`   | `/notas`     | Emite uma nova nota fiscal e decrementa o estoque automaticamente |
| `DELETE` | `/notas/:id` | Bloqueia a remoção de nota fiscal após emissão                    |

Exemplo de corpo para emissão:

```json
{
  "numero_nota": "NF-2025-0001",
  "data_emissao": "2025-06-10",
  "valor_total": 110000.00,
  "id_cliente": 1,
  "id_vendedor": 1,
  "id_carro": 1
}
```

> Notas fiscais não podem ser removidas após a emissão, garantindo a integridade do histórico.

---

## 🔒 Regras de Negócio

As validações foram implementadas na camada de **Service**, mantendo os Controllers responsáveis apenas pelo tratamento das requisições e respostas HTTP.

| Regra    | Descrição resumida                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RN01** | Cliente deve possuir CPF único; nome, CPF e telefone são obrigatórios; cliente com nota fiscal não pode ser removido                                      |
| **RN02** | Vendedor deve possuir matrícula única; comissão deve estar entre 0 e 30; vendedor com nota fiscal não pode ser removido                                   |
| **RN03** | Carro deve possuir placa única; ano deve estar entre 1950 e ano atual + 1; preço deve ser maior que zero; carro com estoque ou nota não pode ser removido |
| **RN04** | Cada carro pode ter apenas um registro de estoque; quantidade deve ser maior ou igual a zero; data de entrada não pode ser futura                         |
| **RN05** | Nota fiscal só pode ser emitida se o carro tiver estoque disponível; ao emitir, o estoque é decrementado em uma unidade                                   |
| **RN06** | Permite consultar notas por cliente, notas por vendedor, estoque por carro e carros disponíveis                                                           |

---

## 📡 Padrão de Respostas HTTP

| Status                     | Situação                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `200 OK`                   | Requisição bem-sucedida                                                            |
| `201 Created`              | Recurso criado com sucesso                                                         |
| `400 Bad Request`          | Dados inválidos ou campos obrigatórios ausentes                                    |
| `404 Not Found`            | Recurso não encontrado                                                             |
| `409 Conflict`             | Violação de unicidade, como CPF, matrícula, placa ou número da nota duplicados     |
| `422 Unprocessable Entity` | Regra de negócio impede a operação, como remoção bloqueada ou estoque insuficiente |

---

## 🛠️ Tecnologias utilizadas

| Tecnologia          | Descrição                                              |
| ------------------- | ------------------------------------------------------ |
| **Node.js**         | Ambiente de execução JavaScript no servidor            |
| **TypeScript**      | Linguagem utilizada no desenvolvimento da API          |
| **Express**         | Framework utilizado para criação das rotas HTTP        |
| **MySQL**           | Banco de dados relacional utilizado para persistência  |
| **mysql2**          | Biblioteca utilizada para conexão com o MySQL          |
| **dotenv**          | Utilizado para variáveis de ambiente                   |
| **Postman**         | Utilizado para testes manuais dos endpoints            |
| **Arquitetura MVC** | Organização em camadas com responsabilidades separadas |

---

## 📁 Estrutura do Projeto

```txt
projeto_concessionaria/
├── src/
│   ├── controllers/
│   │   ├── ClienteController.ts
│   │   ├── VendedorController.ts
│   │   ├── CarroController.ts
│   │   ├── EstoqueController.ts
│   │   └── NotaController.ts
│   ├── database/
│   │   └── mysql.ts
│   ├── models/
│   │   ├── Cliente.ts
│   │   ├── Vendedor.ts
│   │   ├── Carro.ts
│   │   ├── Estoque.ts
│   │   └── Nota.ts
│   ├── repositories/
│   │   ├── ClienteRepository.ts
│   │   ├── VendedorRepository.ts
│   │   ├── CarroRepository.ts
│   │   ├── EstoqueRepository.ts
│   │   └── NotaRepository.ts
│   ├── routes/
│   │   └── router.ts
│   ├── services/
│   │   ├── ClienteService.ts
│   │   ├── VendedorService.ts
│   │   ├── CarroService.ts
│   │   ├── EstoqueService.ts
│   │   └── NotaService.ts
│   └── app.ts
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Testes

O projeto possui uma collection do Postman com requisições válidas e inválidas para os principais endpoints.

Para executar os testes manualmente:

1. Inicie o servidor:

```bash
npm run dev
```

2. Importe a collection no Postman.

3. Execute as requisições em ordem.

Antes de rodar testes completos, recomenda-se limpar o banco para evitar conflitos de dados duplicados:

```sql
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE notas;
TRUNCATE TABLE estoque;
TRUNCATE TABLE carros;
TRUNCATE TABLE clientes;
TRUNCATE TABLE vendedores;

SET FOREIGN_KEY_CHECKS = 1;
```

Também foi utilizado o testador disponibilizado no enunciado da atividade para validar os endpoints da API.

---

## ✅ Resultado dos testes

A API foi validada com o testador automatizado disponibilizado pelo professor, obtendo o seguinte resultado:

```txt
57/57 testes passaram
0 falhas
```

---

## ✒️ Autoria

**Matheus Nakagaki Gouveia**
**João Vitor de Campos Ferrari**

Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas
IFSP - Câmpus Boituva

---

## 📄 Licença

Este projeto está licenciado sob a **GNU General Public License v3.0**.

---

## 🎁 Agradecimentos

Agradecemos ao **Prof. Dr. Anisio Silva** pela proposta do projeto e pelas orientações durante a disciplina de Programação Web.

---

> `#concessionaria` `#api` `#typescript` `#nodejs` `#mysql` `#express` `#ifsp` `#ads` `#backend` `#restapi` `#mvc`
