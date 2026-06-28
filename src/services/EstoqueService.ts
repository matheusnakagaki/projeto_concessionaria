import { Estoque } from "../models/Estoque";
import { CarroRepository } from "../repositories/CarroRepository";
import { EstoqueRepository } from "../repositories/EstoqueRepository";

export class EstoqueService {
  estoqueRepository: EstoqueRepository = EstoqueRepository.getInstance();
  carroRepository: CarroRepository = CarroRepository.getInstance();

  cadastrarEstoque(dadosEstoque: any): Estoque {
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

    const carro = this.carroRepository.filtraPorId(Number(id_carro));

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

    const estoqueExistente = this.estoqueRepository.filtraPorIdCarro(
      Number(id_carro),
    );

    if (estoqueExistente) {
      throw new Error("Já existe estoque para este carro");
    }

    const id_estoque = this.estoqueRepository.gerarProximoId();

    const novoEstoque = new Estoque(
      id_estoque,
      id_carro,
      quantidade,
      localizacao_patio,
      new Date(data_entrada),
    );
    this.estoqueRepository.cadastra(novoEstoque);
    return novoEstoque;
  }

  listarEstoques(): Estoque[] {
    return this.estoqueRepository.listaTodos();
  }

  buscarPorId(id: number): Estoque {
    const estoque = this.estoqueRepository.filtraPorId(id);
    if (!estoque) throw new Error("Estoque não encontrado");
    return estoque;
  }

  buscarEstoquePorCarro(id_carro: number): Estoque {
    const estoque = this.estoqueRepository.filtraPorIdCarro(id_carro);
    if (!estoque) {
      throw new Error("Estoque não encontrado para este carro.");
    }
    return estoque;
  }

  atualizarEstoque(id: number, dadosEstoque: any): Estoque {
    const estoqueExistente = this.estoqueRepository.filtraPorId(id);

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
      estoqueExistente.id_estoque,
      estoqueExistente.id_carro,
      quantidade,
      localizacao_patio,
      data_entrada,
    );

    this.estoqueRepository.atualiza(id, estoqueAtualizado);

    return estoqueAtualizado;
  }

  removerEstoque(id: number): void {
    const estoque = this.estoqueRepository.filtraPorId(id);

    if (!estoque) {
      throw new Error("Estoque não encontrado");
    }

    this.estoqueRepository.remove(id);
  }
}
