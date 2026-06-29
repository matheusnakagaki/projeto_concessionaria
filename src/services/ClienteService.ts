import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { NotaRepository } from "../repositories/NotaRepository"; // RN de exclusão

export class ClienteService {
  clienteRepository: ClienteRepository = ClienteRepository.getInstance();
  notaRepository: NotaRepository = NotaRepository.getInstance();

  async cadastrarCliente(dadosCliente: any): Promise<Cliente> {
    const { nome, cpf, telefone, email, cidade } = dadosCliente;

    if (!nome || !cpf || !telefone) {
      throw new Error("Informações obrigatórias incompletas");
    }

    const clienteExistente = await this.clienteRepository.filtraPorCpf(cpf);

    if (clienteExistente) {
      throw new Error("Já existe um cliente com este CPF");
    }

    const novoCliente = new Cliente(null, nome, cpf, telefone, email, cidade);

    return await this.clienteRepository.cadastra(novoCliente);
  }

  async listarClientes(): Promise<Cliente[]> {
    return this.clienteRepository.listaTodos();
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.filtraPorId(id);

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    return cliente;
  }

  async atualizarCliente(id: number, dados: any): Promise<Cliente> {
    const clienteExistente = await this.clienteRepository.filtraPorId(id);
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

    const clienteComMesmoCpf = await this.clienteRepository.filtraPorCpf(cpf);
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

    const clienteSalvo = await this.clienteRepository.atualiza(
      id,
      clienteAtualizado,
    );

    if (!clienteSalvo) {
      throw new Error("Cliente não encontrado");
    }

    return clienteSalvo;
  }

  // RN01: Não permitir remover se tiver notas vinculadas
  async removerCliente(id: number): Promise<void> {
    const cliente = await this.clienteRepository.filtraPorId(id);
    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    const notasDoCliente = this.notaRepository.filtraNotaPorIdCliente(id);
    if (notasDoCliente.length > 0) {
      throw new Error(
        "Não é permitido remover cliente que possui notas fiscais vinculadas",
      );
    }
    await this.clienteRepository.remove(id);
  }
}
