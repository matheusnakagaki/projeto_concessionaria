# 🚗 API Concessionária

Uma API REST desenvolvida para o gerenciamento inteligente de uma concessionária de veículos, criada como projeto avaliativo da disciplina de **Programação Web** do Curso Superior de Tecnologia em **Análise e Desenvolvimento de Sistemas (ADS)** do **IFSP - Câmpus Boituva**.

O sistema gerencia **Clientes**, **Vendedores**, **Carros**, **Estoque** e **Notas Fiscais**, seguindo rigorosamente as regras de negócio estabelecidas, com persistência em memória e arquitetura em camadas (MVC).

***

## 🚀 Começando

Estas instruções permitirão que você execute o projeto localmente para testes e avaliação das funcionalidades.

***

## 📋 Pré-requisitos

Para rodar este projeto, você precisa ter instalado no seu ambiente:

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- npm
- TypeScript
- Express
- [Postman](https://www.postman.com/) (recomendado para testar as rotas da API)

***

## 🐧 Instalação

> Compatível com **Linux**, **macOS** e **Windows**.

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

***

## ⚙️ Como executar

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

> URL base: `http://localhost:3000`

***

## 📌 Principais Rotas da API

A API segue os princípios REST, utilizando os verbos `GET`, `POST`, `PUT` e `DELETE`. Todas as requisições e respostas utilizam formato **JSON**.

### 👤 Clientes — `/clientes`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/clientes` | Lista todos os clientes cadastrados |
| `GET` | `/clientes/:id` | Retorna os dados de um cliente pelo id |
| `POST` | `/clientes` | Cadastra um novo cliente |
| `PUT` | `/clientes/:id` | Atualiza os dados de um cliente existente |
| `DELETE` | `/clientes/:id` | Remove um cliente (somente se não possuir notas fiscais — RN01) |
| `GET` | `/clientes/notas/:id` | Lista todas as notas fiscais de um cliente |

### 🧑‍💼 Vendedores — `/vendedores`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/vendedores` | Lista todos os vendedores |
| `GET` | `/vendedores/:id` | Retorna um vendedor pelo id |
| `POST` | `/vendedores` | Cadastra um novo vendedor |
| `PUT` | `/vendedores/:id` | Atualiza um vendedor existente |
| `DELETE` | `/vendedores/:id` | Remove um vendedor (sem notas vinculadas — RN02) |
| `GET` | `/vendedores/notas/:id` | Lista todas as notas fiscais de um vendedor |

### 🚘 Carros — `/carros`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/carros` | Lista todos os carros |
| `GET` | `/carros/:id` | Retorna um carro pelo id |
| `GET` | `/carros/disponiveis` | Lista carros com estoque > 0 (RN06) |
| `POST` | `/carros` | Cadastra um novo carro |
| `PUT` | `/carros/:id` | Atualiza um carro existente |
| `DELETE` | `/carros/:id` | Remove um carro (sem estoque ou notas vinculadas — RN03) |

### 📦 Estoque — `/estoque`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/estoque` | Lista todos os registros de estoque |
| `GET` | `/estoque/:id` | Retorna um registro de estoque pelo id |
| `GET` | `/estoque/carro/:id_carro` | Retorna o estoque de um carro específico (RN06) |
| `POST` | `/estoque` | Cria um novo registro de estoque (RN04) |
| `PUT` | `/estoque/:id` | Atualiza quantidade ou localização |
| `DELETE` | `/estoque/:id` | Remove um registro de estoque |

### 🧾 Notas Fiscais — `/notas`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/notas` | Lista todas as notas fiscais |
| `GET` | `/notas/:id` | Retorna uma nota fiscal pelo id |
| `POST` | `/notas` | Emite uma nova nota fiscal e decrementa estoque automaticamente (RN05) |

> ⚠️ Notas fiscais **não podem ser removidas** após a emissão, garantindo integridade histórica.

***

## 🔒 Regras de Negócio

Todas as validações são aplicadas na camada de **serviço**, retornando respostas HTTP adequadas em caso de violação.

| Regra | Descrição resumida |
|-------|--------------------|
| **RN01** | CPF obrigatório e único; `nome` e `telefone` obrigatórios; remoção bloqueada se houver notas |
| **RN02** | `matricula` obrigatória e única; `comissao_percentual` entre 0 e 30; remoção bloqueada se houver notas |
| **RN03** | `placa` obrigatória e única; `ano` entre 1950 e anoAtual+1; `preco` > 0; remoção bloqueada se houver estoque ou notas |
| **RN04** | Um registro de estoque por carro; `quantidade` ≥ 0; `data_entrada` não pode ser futura; usar PUT para atualizar |
| **RN05** | Nota só emitida se estoque > 0 (decrementa 1); `numero_nota` único; `data_emissao` não pode ser futura |
| **RN06** | Listagem de notas por cliente/vendedor; consulta de estoque por carro; listagem de carros disponíveis |

***

## 📡 Padrão de Respostas HTTP

| Status | Situação |
|--------|----------|
| `200 OK` | Requisição bem-sucedida (GET, PUT) |
| `201 Created` | Recurso criado com sucesso (POST) |
| `400 Bad Request` | Dados inválidos ou campos obrigatórios ausentes |
| `404 Not Found` | Recurso não encontrado pelo id informado |
| `409 Conflict` | Violação de unicidade (CPF, matrícula, placa, número da nota) |
| `422 Unprocessable` | Regra de negócio impede a operação (ex.: remoção com notas vinculadas, estoque insuficiente) |

***

## 🛠️ Tecnologias utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| **TypeScript** | Tipagem estática para maior segurança no desenvolvimento |
| **Express** | Framework para criação da estrutura da API HTTP |
| **Node.js** | Ambiente de execução JavaScript no servidor |
| **Arquitetura MVC** | Separação clara entre Model, Repository, Service e Controller |

***

## 📁 Estrutura do Projeto

```
projeto/
├── src/
│   ├── models/          # Interfaces e tipos TypeScript (sem lógica)
│   │   ├── Cliente.ts
│   │   ├── Vendedor.ts
│   │   ├── Carro.ts
│   │   ├── Estoque.ts
│   │   └── NotaFiscal.ts
│   ├── repositories/    # Persistência em memória (arrays singleton)
│   │   ├── clienteRepository.ts
│   │   ├── vendedorRepository.ts
│   │   ├── carroRepository.ts
│   │   ├── estoqueRepository.ts
│   │   └── notaFiscalRepository.ts
│   ├── services/        # Regras de negócio
│   │   ├── clienteService.ts
│   │   ├── vendedorService.ts
│   │   ├── carroService.ts
│   │   ├── estoqueService.ts
│   │   └── notaFiscalService.ts
│   ├── controllers/     # Tratamento de Request e Response HTTP
│   │   ├── clienteController.ts
│   │   ├── vendedorController.ts
│   │   ├── carroController.ts
│   │   ├── estoqueController.ts
│   │   └── notaFiscalController.ts
│   └── app.ts           # Configuração do Express e definição das rotas
├── package.json
├── tsconfig.json
└── README.md
```

***

## ✒️ Autoria

**Matheus Nakagaki Gouveia e João Vitor de Campos Ferrari** — Acadêmico de Análise e Desenvolvimento de Sistemas no IFSP Boituva.

***

## 📄 Licença

Este projeto está licenciado sob a **GNU General Public License v3.0**.

***

## 🎁 Agradecimentos

Agradeço aos colegas de equipe do **TADS Inclusivo** e ao corpo docente do **IFSP Boituva**, em especial ao **Prof. Dr. Anisio Silva**, pelo suporte e pelo desafio técnico na construção deste sistema de gerenciamento de concessionária.

***

> `#concessionaria` `#api` `#typescript` `#nodejs` `#ifsp` `#ads` `#backend` `#restapi` `#mvc` `#programacaoweb`