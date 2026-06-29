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

  async cadastrarNota(dadosNota: any): Promise<Nota> {
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
    const cliente = await this.clienteRepository.filtraPorId(
      Number(id_cliente),
    );
    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    const vendedor = await this.vendedorRepository.filtraPorId(
      Number(id_vendedor),
    );
    if (!vendedor) {
      throw new Error("Vendedor não encontrado");
    }

    const carro = await this.carroRepository.filtraPorId(Number(id_carro));
    if (!carro) {
      throw new Error("Carro não encontrado");
    }

    // Validação de Estoque (RN05)
    const estoque = await this.estoqueRepository.filtraPorIdCarro(
      Number(id_carro),
    );
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
    const notaExistente =
      await this.notaRepository.filtraPorNumeroNota(numero_nota);

    if (notaExistente) {
      throw new Error("Já existe uma nota com este número");
    }

    const novaNota = new Nota(
      null,
      numero_nota,
      dataEmissao,
      Number(valor_total),
      Number(id_cliente),
      Number(id_vendedor),
      Number(id_carro),
    );

    const notaSalva = await this.notaRepository.cadastra(novaNota);

    // Decrementar estoque (RN05)
    if (estoque.id_estoque === null) {
      throw new Error("Estoque inválido");
    }

    const estoqueAtualizado = new Estoque(
      estoque.id_estoque,
      estoque.id_carro,
      estoque.quantidade - 1,
      estoque.localizacao_patio,
      estoque.data_entrada,
    );

    await this.estoqueRepository.atualiza(
      estoque.id_estoque,
      estoqueAtualizado,
    );

    return notaSalva;
  }

  async listarNotas(): Promise<Nota[]> {
    return await this.notaRepository.listaTodos();
  }

  async buscarPorId(id: number): Promise<Nota> {
    const nota = await this.notaRepository.filtraPorId(id);

    if (!nota) {
      throw new Error("Nota não encontrada");
    }

    return nota;
  }
}
