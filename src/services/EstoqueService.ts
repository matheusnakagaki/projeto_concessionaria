import { Estoque } from "../models/Estoque";
import { CarroRepository } from "../repositories/CarroRepository";
import { EstoqueRepository } from "../repositories/EstoqueRepository";

export class EstoqueService {
  estoqueRepository: EstoqueRepository = EstoqueRepository.getInstance();
  carroRepository: CarroRepository = CarroRepository.getInstance();

  cadastrarEstoque(dadosEstoque: any): Estoque {
    const {
      id_estoque,
      id_carro,
      quantidade,
      localizacao_patio,
      data_entrada,
    } = dadosEstoque;

    if (!id_carro || quantidade === undefined || !localizacao_patio || !data_entrada) {
      throw new Error("Informações obrigatórias incompletas");
    }
    const carro = this.carroRepository.filtraPorId(id_carro);
    if (!carro) {
      throw new Error(
        "Carro não encontrado. Não é possível adicionar ao estoque.",
      );
    }
    if (this.estoqueRepository.filtraPorIdCarro(id_carro)) {
      throw new Error("Este carro já possui um registro de estoque.");
    }
    if (quantidade < 0) {
      throw new Error("A quantidade em estoque não pode ser negativa.");
    }
    if (new Date(data_entrada) > new Date()) {
      throw new Error(
        "Não permitido o uso de data de entrada maior do que a data atual",
      );
    }

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

  atualizarEstoque(id: number, dados: any): Estoque {
    const estoque = this.buscarPorId(id);
    if (dados.quantidade !== undefined) estoque.quantidade = dados.quantidade;
    if (dados.localizacao_patio) estoque.localizacao_patio = dados.localizacao_patio;

    this.estoqueRepository.atualiza(id, estoque);
    return estoque;
  }

  removerEstoque(id: number): void {
    this.estoqueRepository.remove(id);
  }
}