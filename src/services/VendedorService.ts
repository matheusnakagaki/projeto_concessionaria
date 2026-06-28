import { Vendedor } from "../models/Vendedor";
import { VendedorRepository } from "../repositories/VendedorRepository";
import { NotaRepository } from "../repositories/NotaRepository"; // RN de exclusão

export class VendedorService {
  vendedorRepository: VendedorRepository = VendedorRepository.getInstance();
  notaRepository: NotaRepository = NotaRepository.getInstance();

  cadastrarVendedor(dadosVendedor: any): Vendedor {
    const { nome, matricula, comissao_percentual } = dadosVendedor;

    if (!nome || !matricula || comissao_percentual === undefined) {
      throw new Error("Informações obrigatórias incompletas");
    }
    // Unicidade da chave primária

    if (this.vendedorRepository.filtraPorMatricula(matricula)) {
      throw new Error("Já existe um vendedor com esta Matrícula");
    }
    if (comissao_percentual < 0 || comissao_percentual > 30) {
      throw new Error(
        "Percentual de Comissão deve ser maior que 0 e menor que 30",
      );
    }

    const id_vendedor = this.vendedorRepository.gerarProximoId();

    const novoVendedor = new Vendedor(
      id_vendedor,
      nome,
      matricula,
      comissao_percentual,
    );
    this.vendedorRepository.cadastra(novoVendedor);
    return novoVendedor;
  }

  listarVendedores(): Vendedor[] {
    return this.vendedorRepository.listaTodos();
  }

  buscarPorId(id: number): Vendedor {
    const vendedor = this.vendedorRepository.filtraPorId(id);
    if (!vendedor) throw new Error("Vendedor não encontrado");
    return vendedor;
  }

  atualizarVendedor(id: number, dados: any): Vendedor {
    const vendedorExistente = this.vendedorRepository.filtraPorId(id);

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
    this.vendedorRepository.atualiza(id, vendedorAtualizado);
    return vendedorAtualizado;
  }

  // RN02: Não permitir remover se tiver notas vinculadas
  removerVendedor(id: number): void {
    const vendedor = this.vendedorRepository.filtraPorId(id);
    if (!vendedor) {
      throw new Error("Vendedor não encontrado");
    }
    const notasDoVendedor = this.notaRepository.filtraNotaPorIdVendedor(id);
    if (notasDoVendedor.length > 0) {
      throw new Error(
        "Não é permitido remover vendedor que possui notas fiscais vinculadas",
      );
    }
    this.vendedorRepository.remove(id);
  }
}
