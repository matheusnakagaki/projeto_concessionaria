import { Cliente } from "../models/Cliente";
import { executarComandoSQL } from "../database/mysql";

export class ClienteRepository {
  private static instance: ClienteRepository;
  private clientes: Cliente[] = [];
  private proximoId: number = 1;

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
  
  gerarProximoId(): number {
    return this.proximoId++;
  }

  // LISTAGEM
  listaTodos(): Cliente[] {
    return this.clientes;
  }

  // BUSCA
  filtraPorId(id: number): Cliente | undefined {
    return this.clientes.find((cliente) => cliente.id_cliente === id);
  }

  // CADASTRO
  cadastra(cliente: Cliente): void {
    this.clientes.push(cliente);
  }

  // ATUALIZAÇÃO
  atualiza(id: number, clienteAtualizado: Cliente): boolean {
    const index = this.clientes.findIndex(
      (cliente) => cliente.id_cliente === id,
    );
    if (index !== -1) {
      this.clientes[index] = clienteAtualizado;
      return true;
    }
    return false;
  }

  // REMOÇÃO
  remove(id: number): void {
    const index = this.clientes.findIndex(
      (cliente) => cliente.id_cliente === id,
    );
    if (index !== -1) {
      this.clientes.splice(index, 1);
    }
  }

  // FILTRO INTERNO (RN01) -> Validação acontece na camada de serviço
  filtraPorCpf(cpf: string): Cliente | undefined {
    return this.clientes.find((cliente) => cliente.cpf === cpf);
  }
}
