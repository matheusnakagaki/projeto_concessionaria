import { Nota } from "../models/Nota";
import { executarComandoSQL } from "../database/mysql";

export class NotaRepository {
  private static instance: NotaRepository;

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

  // LISTAGEM
  async listaTodos(): Promise<Nota[]> {
    const linhas = await executarComandoSQL(
      "SELECT id_nota, numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro FROM notas",
      [],
    );

    return linhas.map((linha: any) => {
      return new Nota(
        linha.id_nota,
        linha.numero_nota,
        new Date(linha.data_emissao),
        Number(linha.valor_total),
        linha.id_cliente,
        linha.id_vendedor,
        linha.id_carro,
      );
    });
  }

  // BUSCA POR ID DA NOTA
  async filtraPorId(id: number): Promise<Nota | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_nota, numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro FROM notas WHERE id_nota = ?",
      [id],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Nota(
      linha.id_nota,
      linha.numero_nota,
      new Date(linha.data_emissao),
      Number(linha.valor_total),
      linha.id_cliente,
      linha.id_vendedor,
      linha.id_carro,
    );
  }

  // FILTROS RN
  async filtraNotaPorIdCliente(id_cliente: number): Promise<Nota[]> {
    const linhas = await executarComandoSQL(
      "SELECT id_nota, numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro FROM notas WHERE id_cliente = ?",
      [id_cliente],
    );

    return linhas.map((linha: any) => {
      return new Nota(
        linha.id_nota,
        linha.numero_nota,
        new Date(linha.data_emissao),
        Number(linha.valor_total),
        linha.id_cliente,
        linha.id_vendedor,
        linha.id_carro,
      );
    });
  }

  async filtraNotaPorIdVendedor(id_vendedor: number): Promise<Nota[]> {
    const linhas = await executarComandoSQL(
      "SELECT id_nota, numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro FROM notas WHERE id_vendedor = ?",
      [id_vendedor],
    );

    return linhas.map((linha: any) => {
      return new Nota(
        linha.id_nota,
        linha.numero_nota,
        new Date(linha.data_emissao),
        Number(linha.valor_total),
        linha.id_cliente,
        linha.id_vendedor,
        linha.id_carro,
      );
    });
  }

  async filtraNotaPorIdCarro(id_carro: number): Promise<Nota[]> {
    const linhas = await executarComandoSQL(
      "SELECT id_nota, numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro FROM notas WHERE id_carro = ?",
      [id_carro],
    );

    return linhas.map((linha: any) => {
      return new Nota(
        linha.id_nota,
        linha.numero_nota,
        new Date(linha.data_emissao),
        Number(linha.valor_total),
        linha.id_cliente,
        linha.id_vendedor,
        linha.id_carro,
      );
    });
  }

  async filtraPorNumeroNota(numero_nota: string): Promise<Nota | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_nota, numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro FROM notas WHERE numero_nota = ?",
      [numero_nota],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Nota(
      linha.id_nota,
      linha.numero_nota,
      new Date(linha.data_emissao),
      Number(linha.valor_total),
      linha.id_cliente,
      linha.id_vendedor,
      linha.id_carro,
    );
  }

  async cadastra(nota: Nota): Promise<Nota> {
    const resultado = await executarComandoSQL(
      "INSERT INTO notas (numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro) VALUES (?, ?, ?, ?, ?, ?)",
      [
        nota.numero_nota,
        nota.data_emissao,
        nota.valor_total,
        nota.id_cliente,
        nota.id_vendedor,
        nota.id_carro,
      ],
    );

    return new Nota(
      resultado.insertId,
      nota.numero_nota,
      nota.data_emissao,
      nota.valor_total,
      nota.id_cliente,
      nota.id_vendedor,
      nota.id_carro,
    );
  }

  // REMOÇÃO
  async remove(id: number): Promise<boolean> {
    const resultado = await executarComandoSQL(
      "DELETE FROM notas WHERE id_nota = ?",
      [id],
    );

    return resultado.affectedRows > 0;
  }
}
