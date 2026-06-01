import { Carro } from "../models/Carro";
import { CarroRepository } from "../repositories/CarroRepository";
import { NotaRepository } from "../repositories/NotaRepository"; // RN de exclusão
import { EstoqueRepository } from "../repositories/EstoqueRepository"; // RN de exclusão

export class CarroService {
  carroRepository: CarroRepository = CarroRepository.getInstance();
  notaRepository: NotaRepository = NotaRepository.getInstance();
  estoqueRepository: EstoqueRepository = EstoqueRepository.getInstance();

  cadastrarCarro(dadosCarro: any): Carro {
    const { id_carro, marca, modelo, ano, placa, preco, cor } = dadosCarro;

    if (!id_carro || !marca || !modelo || !ano || !placa || !preco || !cor) {
      throw new Error("Informações obrigatórias incompletas");
    }
    // Unicidade da chave primária
    if (this.carroRepository.filtraPorId(id_carro)) {
      throw new Error("Já existe um carro com este ID");
    }
    if (this.carroRepository.filtraPorPlaca(placa)) {
      throw new Error("Já existe um carro com esta Placa");
    }
    const currentYear = new Date().getFullYear();
    if (ano < 1950 || ano > currentYear + 1) {
      throw new Error("Ano não permitido");
    }
    if (preco < 0 && preco == undefined) {
      throw new Error("O valor do carro deve ser maior que zero");
    }
    const novoCarro = new Carro(
      id_carro,
      marca,
      modelo,
      ano,
      placa,
      preco,
      cor,
    );
    this.carroRepository.cadastra(novoCarro);
    return novoCarro;
  }

  listarCarros(): Carro[] {
    return this.carroRepository.listaTodos();
  }

  buscarPorId(id: number): Carro {
    const carro = this.carroRepository.filtraPorId(id);
    if (!carro) throw new Error("Carro não encontrado");
    return carro;
  }

  atualizarCarro(id: number, dados: any): Carro {
    const carro = this.buscarPorId(id);
    if (dados.marca) carro.marca = dados.marca;
    if (dados.modelo) carro.modelo = dados.modelo;
    if (dados.ano) carro.ano = dados.ano;
    if (dados.placa) carro.placa = dados.placa;
    if (dados.preco) carro.preco = dados.preco;
    if (dados.cor) carro.cor = dados.cor;

    this.carroRepository.atualiza(id, carro);
    return carro;
  }

  removerCarro(id: number): void {
    // RN03: Não permitir remover se tiver notas vinculadas
    const notasVinculadas = this.notaRepository.filtraNotaPorIdCarro(id);
    if (notasVinculadas.length > 0) {
      throw new Error(
        "Não é permitido remover um carro com notas fiscais vinculadas",
      );
    }
    // RN03: Não permitir remover se tiver em estoque
    const estoqueVinculado = this.estoqueRepository.filtraPorIdCarro(id);
    if (estoqueVinculado && estoqueVinculado.quantidade > 0) {
      throw new Error(
        "Não é permitido remover carro que possui estoque disponível",
      );
    }
    this.carroRepository.remove(id);
  }
}


// implementar listagem de carros com estoque > 0
