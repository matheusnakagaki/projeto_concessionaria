import { Cliente } from "../models/Cliente";
import { executarComandoSQL } from "../database/mysql";

export class ClienteRepository {
  private static instance: ClienteRepository;

  private constructor() {}

  public static getInstance(): ClienteRepository {
    if (!this.instance) {
      this.instance = new ClienteRepository();
    }
    return this.instance;
  }

  static getCreateTableQuery(): string {
    return `
    CREATE TABLE IF NOT EXISTS clientes (
      id_cliente INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      cpf VARCHAR(20) NOT NULL UNIQUE,
      telefone VARCHAR(30) NOT NULL,
      email VARCHAR(255),
      cidade VARCHAR(100)
    );
  `;
  }

  // LISTAGEM
  async listaTodos(): Promise<Cliente[]> {
    const linhas = await executarComandoSQL(
      "SELECT id_cliente, nome, cpf, telefone, email, cidade FROM clientes",
      [],
    );

    return linhas.map((linha: any) => {
      return new Cliente(
        linha.id_cliente,
        linha.nome,
        linha.cpf,
        linha.telefone,
        linha.email,
        linha.cidade,
      );
    });
  }

  // BUSCA
  async filtraPorId(id: number): Promise<Cliente | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_cliente, nome, cpf, telefone, email, cidade FROM clientes WHERE id_cliente = ?",
      [id],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Cliente(
      linha.id_cliente,
      linha.nome,
      linha.cpf,
      linha.telefone,
      linha.email,
      linha.cidade,
    );
  }

  // CADASTRO
  async cadastra(cliente: Cliente): Promise<Cliente> {
    const resultado = await executarComandoSQL(
      "INSERT INTO clientes (nome, cpf, telefone, email, cidade) VALUES (?, ?, ?, ?, ?)",
      [
        cliente.nome,
        cliente.cpf,
        cliente.telefone,
        cliente.email ?? null,
        cliente.cidade ?? null,
      ],
    );

    return new Cliente(
      resultado.insertId,
      cliente.nome,
      cliente.cpf,
      cliente.telefone,
      cliente.email,
      cliente.cidade,
    );
  }

  // ATUALIZAÇÃO
  async atualiza(
    id: number,
    clienteAtualizado: Cliente,
  ): Promise<Cliente | null> {
    const resultado = await executarComandoSQL(
      "UPDATE clientes SET nome = ?, cpf = ?, telefone = ?, email = ?, cidade = ? WHERE id_cliente = ?",
      [
        clienteAtualizado.nome,
        clienteAtualizado.cpf,
        clienteAtualizado.telefone,
        clienteAtualizado.email ?? null,
        clienteAtualizado.cidade ?? null,
        id,
      ],
    );

    if (resultado.affectedRows === 0) {
      return null;
    }

    return new Cliente(
      id,
      clienteAtualizado.nome,
      clienteAtualizado.cpf,
      clienteAtualizado.telefone,
      clienteAtualizado.email,
      clienteAtualizado.cidade,
    );
  }

  // REMOÇÃO
  async remove(id: number): Promise<boolean> {
    const resultado = await executarComandoSQL(
      "DELETE FROM clientes WHERE id_cliente = ?",
      [id],
    );

    return resultado.affectedRows > 0;
  }

  // FILTRO INTERNO (RN01) -> Validação acontece na camada de serviço
  async filtraPorCpf(cpf: string): Promise<Cliente | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_cliente, nome, cpf, telefone, email, cidade FROM clientes WHERE cpf = ?",
      [cpf],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Cliente(
      linha.id_cliente,
      linha.nome,
      linha.cpf,
      linha.telefone,
      linha.email,
      linha.cidade,
    );
  }
}
