import { Vendedor } from "../models/Vendedor";
import { executarComandoSQL } from "../database/mysql";

export class VendedorRepository {
  private static instance: VendedorRepository;

  private constructor() {}

  public static getInstance(): VendedorRepository {
    if (!this.instance) {
      this.instance = new VendedorRepository();
    }
    return this.instance;
  }

  static getCreateTableQuery(): string {
    return `
    CREATE TABLE IF NOT EXISTS vendedores (
      id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      matricula VARCHAR(50) NOT NULL UNIQUE,
      comissao_percentual DECIMAL(5,2) NOT NULL
    );
  `;
  }

  // LISTAGEM
  async listaTodos(): Promise<Vendedor[]> {
    const linhas = await executarComandoSQL(
      "SELECT id_vendedor, nome, matricula, comissao_percentual FROM vendedores",
      [],
    );

    return linhas.map((linha: any) => {
      return new Vendedor(
        linha.id_vendedor,
        linha.nome,
        linha.matricula,
        Number(linha.comissao_percentual),
      );
    });
  }

  // BUSCA
  async filtraPorId(id: number): Promise<Vendedor | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_vendedor, nome, matricula, comissao_percentual FROM vendedores WHERE id_vendedor = ?",
      [id],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Vendedor(
      linha.id_vendedor,
      linha.nome,
      linha.matricula,
      Number(linha.comissao_percentual),
    );
  }

  // CADASTRO
  async cadastra(vendedor: Vendedor): Promise<Vendedor> {
    const resultado = await executarComandoSQL(
      "INSERT INTO vendedores (nome, matricula, comissao_percentual) VALUES (?, ?, ?)",
      [vendedor.nome, vendedor.matricula, vendedor.comissao_percentual],
    );

    return new Vendedor(
      resultado.insertId,
      vendedor.nome,
      vendedor.matricula,
      vendedor.comissao_percentual,
    );
  }

  // ATUALIZAÇÃO
  async atualiza(
    id: number,
    vendedorAtualizado: Vendedor,
  ): Promise<Vendedor | null> {
    const resultado = await executarComandoSQL(
      "UPDATE vendedores SET nome = ?, matricula = ?, comissao_percentual = ? WHERE id_vendedor = ?",
      [
        vendedorAtualizado.nome,
        vendedorAtualizado.matricula,
        vendedorAtualizado.comissao_percentual,
        id,
      ],
    );

    if (resultado.affectedRows === 0) {
      return null;
    }

    return new Vendedor(
      id,
      vendedorAtualizado.nome,
      vendedorAtualizado.matricula,
      vendedorAtualizado.comissao_percentual,
    );
  }

  // REMOÇÃO
  async remove(id: number): Promise<boolean> {
    const resultado = await executarComandoSQL(
      "DELETE FROM vendedores WHERE id_vendedor = ?",
      [id],
    );

    return resultado.affectedRows > 0;
  }

  // FILTRO INTERNO (RN02) -> Validação acontece na camada de serviço
  async filtraPorMatricula(matricula: string): Promise<Vendedor | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_vendedor, nome, matricula, comissao_percentual FROM vendedores WHERE matricula = ?",
      [matricula],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Vendedor(
      linha.id_vendedor,
      linha.nome,
      linha.matricula,
      Number(linha.comissao_percentual),
    );
  }
}
