import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { NotaRepository } from "../repositories/NotaRepository"; // RN de exclusão

export class ClienteService {
  clienteRepository: ClienteRepository = ClienteRepository.getInstance();
  notaRepository: NotaRepository = NotaRepository.getInstance();

  cadastrarCliente(dadosCliente: any): Cliente {
    const { id_cliente, nome, cpf, telefone, email, cidade } = dadosCliente;

    if (!nome || !cpf || !telefone) {
      throw new Error("Informações obrigatórias incompletas");
    }
    if (this.clienteRepository.filtraPorCpf(cpf)) {
      throw new Error("Já existe um cliente com este CPF");
    }
    const novoCliente = new Cliente(id_cliente, nome, cpf, telefone, email, cidade);
    this.clienteRepository.cadastra(novoCliente);
    return novoCliente;
  }

  listarClientes(): Cliente[] {
    return this.clienteRepository.listaTodos();
  }

  buscarPorId(id: number): Cliente {
    const cliente = this.clienteRepository.filtraPorId(id);
    if (!cliente) throw new Error("Cliente não encontrado");
    return cliente;
  }

  atualizarCliente(id: number, dados: any): Cliente {
    const cliente = this.buscarPorId(id); 
    if (dados.nome) cliente.nome = dados.nome;
    if (dados.cpf) cliente.cpf = dados.cpf;
    if (dados.telefone) cliente.telefone = dados.telefone;
    if (dados.email) cliente.email = dados.email;
    if (dados.cidade) cliente.cidade = dados.cidade;

    this.clienteRepository.atualiza(id, cliente);
    return cliente;
  }

  removerCliente(id: number): void {
    // RN01: Não permitir remover se tiver notas vinculadas
    const notasVinculadas = this.notaRepository.filtraNotaPorIdCliente(id);
    if (notasVinculadas.length > 0) {
      throw new Error("Não é permitido remover cliente com notas fiscais vinculadas");
    }

    this.clienteRepository.remove(id);
  }
}