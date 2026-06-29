import { Nota } from "../models/Nota";
import { Estoque } from "../models/Estoque";
import { NotaRepository } from "../repositories/NotaRepository";
import { EstoqueRepository } from "../repositories/EstoqueRepository";
import { CarroRepository } from "../repositories/CarroRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { VendedorRepository } from "../repositories/VendedorRepository";

export class NotaService {
  notaRepository: NotaRepository = NotaRepository.getInstance();
  estoqueRepository: EstoqueRepository = EstoqueRepository.getInstance();
  carroRepository: CarroRepository = CarroRepository.getInstance();
  clienteRepository: ClienteRepository = ClienteRepository.getInstance();
  vendedorRepository: VendedorRepository = VendedorRepository.getInstance();

  cadastrarNota(dadosNota: any): Nota {
    const {
      numero_nota,
      data_emissao,
      valor_total,
      id_cliente,
      id_vendedor,
      id_carro,
    } = dadosNota;

    if (
      !numero_nota ||
      !data_emissao ||
      valor_total === undefined ||
      id_cliente === undefined ||
      id_vendedor === undefined ||
      id_carro === undefined
    ) {
      throw new Error("Informações obrigatórias incompletas");
    }

    // Validações de existência (RN05)
    if (!this.clienteRepository.filtraPorId(id_cliente))
      throw new Error("Cliente não encontrado");
    if (!this.vendedorRepository.filtraPorId(id_vendedor))
      throw new Error("Vendedor não encontrado");
    if (!this.carroRepository.filtraPorId(id_carro))
      throw new Error("Carro não encontrado");

    // Validação de Estoque (RN05)
    const estoque = this.estoqueRepository.filtraPorIdCarro(Number(id_carro));
    if (!estoque || estoque.quantidade <= 0) {
      throw new Error("Carro indisponível em estoque");
    }

    // Validação de Data (RN05)
    const dataEmissao = new Date(data_emissao);
    const hoje = new Date();

    if (dataEmissao > hoje) {
      throw new Error("Data de emissão não pode ser futura");
    }

    // Validação de Valor
    if (valor_total <= 0) {
      throw new Error("O valor da nota deve ser maior que zero");
    }

    // Validação de Unididade da PK
    if (this.notaRepository.filtraPorNumeroNota(numero_nota)) {
      throw new Error("Já existe uma nota com este número");
    }

    const id_nota = this.notaRepository.gerarProximoId();

    const novaNota = new Nota(
      id_nota,
      numero_nota,
      data_emissao,
      valor_total,
      id_cliente,
      id_vendedor,
      id_carro,
    );
    this.notaRepository.cadastra(novaNota);

    // Decrementar estoque (RN05)
    const estoqueAtualizado = new Estoque(
      estoque.id_estoque,
      estoque.id_carro,
      estoque.quantidade - 1,
      estoque.localizacao_patio,
      estoque.data_entrada,
    );

    if (estoque.id_estoque === null) {
      throw new Error("Estoque inválido");
    }
    this.estoqueRepository.atualiza(estoque.id_estoque, estoqueAtualizado);

    return novaNota;
  }

  listarNotas(): Nota[] {
    return this.notaRepository.listaTodos();
  }

  buscarPorId(id: number): Nota {
    const nota = this.notaRepository.filtraPorId(id);
    if (!nota) throw new Error("Nota não encontrada");
    return nota;
  }
}
