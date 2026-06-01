import { Cliente } from "../models/Cliente";

export class ClienteRepository {
  private static instance: ClienteRepository;
  private clientes: Cliente[] = [];

  private constructor() {}

  public static getInstance(): ClienteRepository {
    if (!this.instance) {
      this.instance = new ClienteRepository();
    }
    return this.instance;
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
  atualiza(id: number, dadosNovos: any): boolean {
    const cliente = this.filtraPorId(id);

    if (cliente) {
      if (dadosNovos.nome) cliente.nome = dadosNovos.nome;
      if (dadosNovos.cpf) cliente.cpf = dadosNovos.cpf;
      if (dadosNovos.telefone) cliente.telefone = dadosNovos.telefone;
      if (dadosNovos.email) cliente.email = dadosNovos.email;
      if (dadosNovos.cidade) cliente.cidade = dadosNovos.cidade;
      return true;
    }
    return false;
  }

  // REMOÇÃO
  remove(id: number): void {
    const index = this.clientes.findIndex((c) => c.id_cliente === id);
    if (index !== -1) {
      this.clientes.splice(index, 1);
    }
  }

  // FILTRO INTERNO (RN01)
  filtraPorCpf(cpf: string): Cliente | undefined {
    return this.clientes.find((cliente) => cliente.cpf === cpf);
  }
}
