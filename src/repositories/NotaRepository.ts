import { Nota } from "../models/Nota";
import { executarComandoSQL } from "../database/mysql";

export class NotaRepository {
  private static instance: NotaRepository;
  private notas: Nota[] = [];
  private proximoId: number = 1;

  private constructor() {}

  public static getInstance(): NotaRepository {
    if (!this.instance) {
      this.instance = new NotaRepository();
    }
    return this.instance;
  }

  static getCreateTableQuery(): string {
    return `
    CREATE TABLE IF NOT EXISTS notas (
      id_nota INT AUTO_INCREMENT PRIMARY KEY,
      numero_nota VARCHAR(50) NOT NULL UNIQUE,
      data_emissao DATE NOT NULL,
      valor_total DECIMAL(10,2) NOT NULL,
      id_cliente INT NOT NULL,
      id_vendedor INT NOT NULL,
      id_carro INT NOT NULL,
      FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
      FOREIGN KEY (id_vendedor) REFERENCES vendedores(id_vendedor),
      FOREIGN KEY (id_carro) REFERENCES carros(id_carro)
    );
  `;
  }

  gerarProximoId(): number {
    return this.proximoId++;
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
