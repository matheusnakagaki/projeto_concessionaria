import { Vendedor } from "../models/Vendedor";
import { VendedorRepository } from "../repositories/VendedorRepository";
import { NotaRepository } from "../repositories/NotaRepository"; // RN de exclusão

export class VendedorService {
  vendedorRepository: VendedorRepository = VendedorRepository.getInstance();
  notaRepository: NotaRepository = NotaRepository.getInstance();

  async cadastrarVendedor(dadosVendedor: any): Promise<Vendedor> {
    const { nome, matricula, comissao_percentual } = dadosVendedor;

    if (!nome || !matricula || comissao_percentual === undefined) {
      throw new Error("Informações obrigatórias incompletas");
    }
    // Unicidade da chave primária

    const vendedorExistente =
      await this.vendedorRepository.filtraPorMatricula(matricula);

    if (vendedorExistente) {
      throw new Error("Já existe um vendedor com esta matrícula");
    }

    if (comissao_percentual < 0 || comissao_percentual > 30) {
      throw new Error("Comissão percentual deve estar entre 0 e 30");
    }

    const novoVendedor = new Vendedor(
      null,
      nome,
      matricula,
      comissao_percentual,
    );

    return await this.vendedorRepository.cadastra(novoVendedor);
  }

  async listarVendedores(): Promise<Vendedor[]> {
    return await this.vendedorRepository.listaTodos();
  }

  async buscarPorId(id: number): Promise<Vendedor> {
    const vendedor = await this.vendedorRepository.filtraPorId(id);

    if (!vendedor) {
      throw new Error("Vendedor não encontrado");
    }

    return vendedor;
  }

  async atualizarVendedor(id: number, dados: any): Promise<Vendedor> {
    const vendedorExistente = await this.vendedorRepository.filtraPorId(id);

    if (!vendedorExistente) {
      throw new Error("Vendedor não encontrado");
    }
    const nome = dados.nome !== undefined ? dados.nome : vendedorExistente.nome;
    const matricula =
      dados.matricula !== undefined
        ? dados.matricula
        : vendedorExistente.matricula;
    const comissao_percentual =
      dados.comissao_percentual !== undefined
        ? dados.comissao_percentual
        : vendedorExistente.comissao_percentual;
    if (!nome || !matricula || comissao_percentual === undefined) {
      throw new Error("Informações obrigatórias incompletas");
    }
    const vendedorComMesmaMatricula =
      await this.vendedorRepository.filtraPorMatricula(matricula);
    this.vendedorRepository.filtraPorMatricula(matricula);
    if (
      vendedorComMesmaMatricula &&
      vendedorComMesmaMatricula.id_vendedor !== id
    ) {
      throw new Error("Já existe um vendedor com esta matrícula");
    }
    if (comissao_percentual < 0 || comissao_percentual > 30) {
      throw new Error("Comissão percentual deve estar entre 0 e 30");
    }
    const vendedorAtualizado = new Vendedor(
      id,
      nome,
      matricula,
      comissao_percentual,
    );
    const vendedorSalvo = await this.vendedorRepository.atualiza(
      id,
      vendedorAtualizado,
    );

    if (!vendedorSalvo) {
      throw new Error("Vendedor não encontrado");
    }

    return vendedorSalvo;
  }

  // RN02: Não permitir remover se tiver notas vinculadas
  async removerVendedor(id: number): Promise<Vendedor> {
    const vendedor = await this.vendedorRepository.filtraPorId(id);

    if (!vendedor) {
      throw new Error("Vendedor não encontrado");
    }

    const notasDoVendedor =
      await this.notaRepository.filtraNotaPorIdVendedor(id);

    if (notasDoVendedor.length > 0) {
      throw new Error(
        "Não é permitido remover vendedor que possui notas fiscais vinculadas",
      );
    }

    await this.vendedorRepository.remove(id);

    return vendedor;
  }
}
