import { Carro } from "../models/Carro";
import { CarroRepository } from "../repositories/CarroRepository";
import { NotaRepository } from "../repositories/NotaRepository"; // RN de exclusão
import { EstoqueRepository } from "../repositories/EstoqueRepository"; // RN de exclusão

export class CarroService {
  carroRepository: CarroRepository = CarroRepository.getInstance();
  notaRepository: NotaRepository = NotaRepository.getInstance();
  estoqueRepository: EstoqueRepository = EstoqueRepository.getInstance();

  cadastrarCarro(dadosCarro: any): Carro {
    const { marca, modelo, ano, placa, preco, cor } = dadosCarro;

    if (!marca || !modelo || !ano || !placa || preco === undefined || !cor) {
      throw new Error("Informações obrigatórias incompletas");
    }
    // Unicidade da chave primária
    if (this.carroRepository.filtraPorPlaca(placa)) {
      throw new Error("Já existe um carro com esta Placa");
    }
    const anoAtual = new Date().getFullYear();
    if (ano < 1950 || ano > anoAtual + 1) {
      throw new Error("Ano não permitido");
    }
    if (preco === undefined || preco <= 0) {
      throw new Error("O valor do carro deve ser maior que zero");
    }

    const id_carro = this.carroRepository.gerarProximoId();

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
    const carroExistente = this.carroRepository.filtraPorId(id);
    if (!carroExistente) {
      throw new Error("Carro não encontrado");
    }

    const marca =
      dados.marca !== undefined ? dados.marca : carroExistente.marca;
    const modelo =
      dados.modelo !== undefined ? dados.modelo : carroExistente.modelo;
    const ano =
      dados.ano !== undefined ? Number(dados.ano) : carroExistente.ano;
    const placa =
      dados.placa !== undefined ? dados.placa : carroExistente.placa;
    const preco =
      dados.preco !== undefined ? Number(dados.preco) : carroExistente.preco;
    const cor = dados.cor !== undefined ? dados.cor : carroExistente.cor;

    if (!marca || !modelo || !ano || !placa || preco === undefined || !cor) {
      throw new Error("Informações obrigatórias incompletas");
    }

    const carroComMesmaPlaca = this.carroRepository.filtraPorPlaca(placa);
    if (carroComMesmaPlaca && carroComMesmaPlaca.id_carro !== id) {
      throw new Error("Já existe um carro com esta placa");
    }

    const anoAtual = new Date().getFullYear();
    if (!Number.isInteger(ano) || ano < 1950 || ano > anoAtual + 1) {
      throw new Error("Ano inválido");
    }
    if (preco <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }

    const carroAtualizado = new Carro(
      id,
      marca,
      modelo,
      ano,
      placa,
      preco,
      cor,
    );

    this.carroRepository.atualiza(id, carroAtualizado);

    return carroAtualizado;
  }

  // RN03: Não permitir remover se tiver notas vinculadas
  removerCarro(id: number): void {
    const carro = this.carroRepository.filtraPorId(id);

    if (!carro) {
      throw new Error("Carro não encontrado");
    }

    const estoqueDoCarro = this.estoqueRepository.filtraPorIdCarro(id);
    const notasDoCarro = this.notaRepository.filtraNotaPorIdCarro(id);

    if (estoqueDoCarro || notasDoCarro.length > 0) {
      throw new Error(
        "Não é permitido remover carro que possui registros em estoque ou notas fiscais vinculadas",
      );
    }

    this.carroRepository.remove(id);
  }

  listarCarrosDisponiveis(): Carro[] {
    const todosOsCarros = this.carroRepository.listaTodos();

    return todosOsCarros.filter((carro) => {
      const estoque = this.estoqueRepository.filtraPorIdCarro(carro.id_carro);
      return estoque && estoque.quantidade > 0;
    });
  }
}
