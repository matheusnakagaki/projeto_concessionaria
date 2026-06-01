import { Nota } from "../models/Nota";

export class NotaRepository {
  private static instance: NotaRepository;
  private notas: Nota[] = [];

  private constructor() {}

  public static getInstance(): NotaRepository {
    if (!this.instance) {
      this.instance = new NotaRepository();
    }
    return this.instance;
  }

  // LISTAGEM
  listaTodos(): Nota[] {
    return this.notas;
  }

  // BUSCA POR ID DA NOTA
  filtraPorId(id: number): Nota | undefined {
    return this.notas.find((nota) => nota.id_nota === id);
  }

  // FILTROS RN
  filtraNotaPorIdCliente(id_cliente: number): Nota[] {
    return this.notas.filter((nota) => nota.id_cliente === id_cliente);
  }

  filtraNotaPorIdVendedor(id_vendedor: number): Nota[] {
    return this.notas.filter((nota) => nota.id_vendedor === id_vendedor);
  }

  filtraNotaPorIdCarro(id_carro: number): Nota[] {
    return this.notas.filter((nota) => nota.id_carro === id_carro);
  }

  filtraPorNumeroNota(numero_nota: string): Nota | undefined {
    return this.notas.find((nota) => nota.numero_nota === numero_nota);
  }
  // CADASTRO
  cadastra(nota: Nota): void {
    this.notas.push(nota);
  }

  // REMOÇÃO
  remove(id: number): void {
    const index = this.notas.findIndex((nota) => nota.id_nota === id);
    if (index !== -1) {
      this.notas.splice(index, 1);
    }
  }
}
