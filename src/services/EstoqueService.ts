import { Estoque } from "../models/Estoque";
import { CarroRepository } from "../repositories/CarroRepository";
import { EstoqueRepository } from "../repositories/EstoqueRepository";

export class EstoqueService {
  estoqueRepository: EstoqueRepository = EstoqueRepository.getInstance();
  carroRepository: CarroRepository = CarroRepository.getInstance();

  async cadastrarEstoque(dadosEstoque: any): Promise<Estoque> {
    const { id_carro, quantidade, localizacao_patio, data_entrada } =
      dadosEstoque;

    if (
      id_carro === undefined ||
      quantidade === undefined ||
      quantidade === null ||
      !localizacao_patio ||
      !data_entrada
    ) {
      throw new Error("Informações obrigatórias incompletas");
    }

    const carro = await this.carroRepository.filtraPorId(Number(id_carro));

    if (!carro) {
      throw new Error(
        "Carro não encontrado. Não é possível adicionar ao estoque.",
      );
    }

    if (!Number.isInteger(quantidade) || quantidade < 0) {
      throw new Error("A quantidade em estoque não pode ser negativa.");
    }

    const dataEntrada = new Date(data_entrada);
    const hoje = new Date();

    if (dataEntrada > hoje) {
      throw new Error("Data de entrada não pode ser futura");
    }

    const estoqueExistente = await this.estoqueRepository.filtraPorIdCarro(
      Number(id_carro),
    );

    if (estoqueExistente) {
      throw new Error("Já existe estoque para este carro");
    }

    const novoEstoque = new Estoque(
      null,
      Number(id_carro),
      quantidade,
      localizacao_patio,
      new Date(data_entrada),
    );

    return await this.estoqueRepository.cadastra(novoEstoque);
  }

  async listarEstoques(): Promise<Estoque[]> {
    return await this.estoqueRepository.listaTodos();
  }

  async buscarPorId(id: number): Promise<Estoque> {
    const estoque = await this.estoqueRepository.filtraPorId(id);
    if (!estoque) throw new Error("Estoque não encontrado");
    return estoque;
  }

  async buscarEstoquePorCarro(id_carro: number): Promise<Estoque> {
    const estoque = await this.estoqueRepository.filtraPorIdCarro(id_carro);
    if (!estoque) {
      throw new Error("Estoque não encontrado para este carro.");
    }
    return estoque;
  }

  async atualizarEstoque(id: number, dadosEstoque: any): Promise<Estoque> {
    const estoqueExistente = await this.estoqueRepository.filtraPorId(id);

    if (!estoqueExistente) {
      throw new Error("Estoque não encontrado");
    }

    const quantidade =
      dadosEstoque.quantidade !== undefined
        ? dadosEstoque.quantidade
        : estoqueExistente.quantidade;

    const localizacao_patio =
      dadosEstoque.localizacao_patio !== undefined
        ? dadosEstoque.localizacao_patio
        : estoqueExistente.localizacao_patio;

    const data_entrada =
      dadosEstoque.data_entrada !== undefined
        ? dadosEstoque.data_entrada
        : estoqueExistente.data_entrada;

    if (!Number.isInteger(quantidade) || quantidade < 0) {
      throw new Error(
        "Quantidade deve ser um número inteiro maior ou igual a zero",
      );
    }

    const dataEntrada = new Date(data_entrada);
    const hoje = new Date();

    if (dataEntrada > hoje) {
      throw new Error("Data de entrada não pode ser futura");
    }

    const estoqueAtualizado = new Estoque(
      id,
      estoqueExistente.id_carro,
      quantidade,
      localizacao_patio,
      new Date(data_entrada),
    );

    const estoqueSalvo = await this.estoqueRepository.atualiza(
      id,
      estoqueAtualizado,
    );

    if (!estoqueSalvo) {
      throw new Error("Estoque não encontrado");
    }

    return estoqueSalvo;
  }

  async removerEstoque(id: number): Promise<Estoque> {
    const estoque = await this.estoqueRepository.filtraPorId(id);

    if (!estoque) {
      throw new Error("Estoque não encontrado");
    }

    await this.estoqueRepository.remove(id);

    return estoque;
  }
}
