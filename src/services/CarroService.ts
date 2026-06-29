import { Carro } from "../models/Carro";
import { CarroRepository } from "../repositories/CarroRepository";
import { NotaRepository } from "../repositories/NotaRepository"; // RN de exclusão
import { EstoqueRepository } from "../repositories/EstoqueRepository"; // RN de exclusão

export class CarroService {
  carroRepository: CarroRepository = CarroRepository.getInstance();
  notaRepository: NotaRepository = NotaRepository.getInstance();
  estoqueRepository: EstoqueRepository = EstoqueRepository.getInstance();

  async cadastrarCarro(dadosCarro: any): Promise<Carro> {
    const { marca, modelo, ano, placa, preco, cor } = dadosCarro;

    if (!marca || !modelo || !ano || !placa || preco === undefined || !cor) {
      throw new Error("Informações obrigatórias incompletas");
    }
    // Unicidade da chave primária
    const carroExistente = await this.carroRepository.filtraPorPlaca(placa);

    if (carroExistente) {
      throw new Error("Já existe um carro com esta placa");
    }
    const anoAtual = new Date().getFullYear();
    if (ano < 1950 || ano > anoAtual + 1) {
      throw new Error("Ano não permitido");
    }
    if (preco === undefined || preco <= 0) {
      throw new Error("O valor do carro deve ser maior que zero");
    }

    const novoCarro = new Carro(null, marca, modelo, ano, placa, preco, cor);

    return await this.carroRepository.cadastra(novoCarro);
  }

  async listarCarros(): Promise<Carro[]> {
    return await this.carroRepository.listaTodos();
  }

  async buscarPorId(id: number): Promise<Carro> {
    const carro = await this.carroRepository.filtraPorId(id);

    if (!carro) {
      throw new Error("Carro não encontrado");
    }

    return carro;
  }

  async atualizarCarro(id: number, dados: any): Promise<Carro> {
    const carroExistente = await this.carroRepository.filtraPorId(id);
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

    const carroComMesmaPlaca = await this.carroRepository.filtraPorPlaca(placa);
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

    const carroSalvo = await this.carroRepository.atualiza(id, carroAtualizado);

    if (!carroSalvo) {
      throw new Error("Carro não encontrado");
    }

    return carroSalvo;
  }

  // RN03: Não permitir remover se tiver notas vinculadas
  async removerCarro(id: number): Promise<Carro> {
    const carro = await this.carroRepository.filtraPorId(id);

    if (!carro) {
      throw new Error("Carro não encontrado");
    }

    const estoqueDoCarro = await this.estoqueRepository.filtraPorIdCarro(id);
    const notasDoCarro = this.notaRepository.filtraNotaPorIdCarro(id);

    if (estoqueDoCarro || notasDoCarro.length > 0) {
      throw new Error(
        "Não é permitido remover carro que possui registros em estoque ou notas fiscais vinculadas",
      );
    }

    await this.carroRepository.remove(id);

    return carro;
  }

  async listarCarrosDisponiveis(): Promise<Carro[]> {
    const todosOsCarros = await this.carroRepository.listaTodos();
    const carrosDisponiveis: Carro[] = [];

    for (const carro of todosOsCarros) {
      if (carro.id_carro === null) {
        continue;
      }

      const estoque = await this.estoqueRepository.filtraPorIdCarro(
        carro.id_carro,
      );

      if (estoque && estoque.quantidade > 0) {
        carrosDisponiveis.push(carro);
      }
    }

    return carrosDisponiveis;
  }
}
