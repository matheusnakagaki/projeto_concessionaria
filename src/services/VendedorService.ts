import { Vendedor } from "../models/Vendedor";
import { VendedorRepository } from "../repositories/VendedorRepository";
import { NotaRepository } from "../repositories/NotaRepository"; // RN de exclusão

export class VendedorService {
  vendedorRepository: VendedorRepository = VendedorRepository.getInstance();
  notaRepository: NotaRepository = NotaRepository.getInstance();

  cadastrarVendedor(dadosVendedor: any): Vendedor {
    const { id_vendedor, nome, matricula, comissao_percentual } = dadosVendedor;

    if (!nome || !matricula || !comissao_percentual) {
      throw new Error("Informações obrigatórias incompletas");
    }
    if (this.vendedorRepository.filtraPorMatricula(matricula)) {
      throw new Error("Já existe um vendedor com esta Matrícula");
    }
    if (comissao_percentual < 0 || comissao_percentual > 30) {
      throw new Error(
        "Percentual de Comissão deve ser maior que 0 e menor que 30",
      );
    }
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
    const vendedor = this.buscarPorId(id);
    if (dados.nome) vendedor.nome = dados.nome;
    if (dados.matricula) vendedor.matricula = dados.matricula;
    if (dados.comissao_percentual !== undefined) {
      vendedor.comissao_percentual = dados.comissao_percentual;
    }
    this.vendedorRepository.atualiza(id, vendedor);
    return vendedor;
  }

  removerVendedor(id: number): void {
    // RN02: Não permitir remover se tiver notas vinculadas
    const notasVinculadas = this.notaRepository.filtraNotaPorIdVendedor(id);
    if (notasVinculadas.length > 0) {
      throw new Error(
        "Não é permitido remover vendedor com notas fiscais vinculadas",
      );
    }

    this.vendedorRepository.remove(id);
  }
}
