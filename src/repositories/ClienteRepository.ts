import { Cliente } from "../models/Cliente";

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
