import { Nota } from "../models/Nota";
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
      id_nota,
      numero_nota,
      data_emissao,
      valor_total,
      id_cliente,
      id_vendedor,
      id_carro,
    } = dadosNota;

    if (
      !id_nota ||
      !numero_nota ||
      !data_emissao ||
      !valor_total ||
      !id_cliente ||
      !id_vendedor ||
      !id_carro
    ) {
      throw new Error("Informações obrigatórias incompletas");
    }

    // Unicidade da chave primária
    if (this.notaRepository.filtraPorId(id_nota)) {
      throw new Error("Já existe uma nota fiscal com este ID");
    }

    // Validações de existência (RN05)
    if (!this.clienteRepository.filtraPorId(id_cliente))
      throw new Error("Cliente não encontrado");
    if (!this.vendedorRepository.filtraPorId(id_vendedor))
      throw new Error("Vendedor não encontrado");
    if (!this.carroRepository.filtraPorId(id_carro))
      throw new Error("Carro não encontrado");

    // Validação de Estoque (RN05)
    const estoque = this.estoqueRepository.filtraPorIdCarro(id_carro);
    if (!estoque || estoque.quantidade <= 0) {
      throw new Error("Carro indisponível em estoque");
    }

    // Validação de Data (RN05)
    if (new Date(data_emissao) > new Date()) {
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

    // Decrementar estoque (RN05)
    estoque.quantidade -= 1;
    this.estoqueRepository.atualiza(estoque.id_estoque, estoque);

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
