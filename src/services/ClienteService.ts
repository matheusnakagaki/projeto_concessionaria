import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { NotaRepository } from "../repositories/NotaRepository"; // RN de exclusão

export class ClienteService {
  clienteRepository: ClienteRepository = ClienteRepository.getInstance();
  notaRepository: NotaRepository = NotaRepository.getInstance();

  cadastrarCliente(dadosCliente: any): Cliente {
    const { nome, cpf, telefone, email, cidade } = dadosCliente;

    if (!nome || !cpf || !telefone) {
      throw new Error("Informações obrigatórias incompletas");
    }

    if (this.clienteRepository.filtraPorCpf(cpf)) {
      throw new Error("Já existe um cliente com este CPF");
    }

    const id_cliente = this.clienteRepository.gerarProximoId();

    const novoCliente = new Cliente(
      id_cliente,
      nome,
      cpf,
      telefone,
      email,
      cidade,
    );
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
    const clienteExistente = this.clienteRepository.filtraPorId(id);

    if (!clienteExistente) {
      throw new Error("Cliente não encontrado");
    }

    const nome = dados.nome !== undefined ? dados.nome : clienteExistente.nome;
    const cpf = dados.cpf !== undefined ? dados.cpf : clienteExistente.cpf;
    const telefone =
      dados.telefone !== undefined ? dados.telefone : clienteExistente.telefone;
    const email =
      dados.email !== undefined ? dados.email : clienteExistente.email;
    const cidade =
      dados.cidade !== undefined ? dados.cidade : clienteExistente.cidade;
    if (!nome || !cpf || !telefone) {
      throw new Error("Informações obrigatórias incompletas");
    }

    const clienteComMesmoCpf = this.clienteRepository.filtraPorCpf(cpf);

    if (clienteComMesmoCpf && clienteComMesmoCpf.id_cliente !== id) {
      throw new Error("Já existe um cliente com este CPF");
    }

    const clienteAtualizado = new Cliente(
      id,
      nome,
      cpf,
      telefone,
      email,
      cidade,
    );

    this.clienteRepository.atualiza(id, clienteAtualizado);

    return clienteAtualizado;
  }

  // RN01: Não permitir remover se tiver notas vinculadas
  removerCliente(id: number): void {
    const cliente = this.clienteRepository.filtraPorId(id);
    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    const notasDoCliente = this.notaRepository.filtraNotaPorIdCliente(id);
    if (notasDoCliente.length > 0) {
      throw new Error(
        "Não é permitido remover cliente que possui notas fiscais vinculadas",
      );
    }
    this.clienteRepository.remove(id);
  }
}
