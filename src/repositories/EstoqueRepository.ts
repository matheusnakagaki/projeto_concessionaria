import { Estoque } from "../models/Estoque";
import { executarComandoSQL } from "../database/mysql";
export class EstoqueRepository {
  private static instance: EstoqueRepository;

  private constructor() {}

  public static getInstance(): EstoqueRepository {
    if (!this.instance) {
      this.instance = new EstoqueRepository();
    }
    return this.instance;
  }

  static getCreateTableQuery(): string {
    return `
    CREATE TABLE IF NOT EXISTS estoque (
      id_estoque INT AUTO_INCREMENT PRIMARY KEY,
      id_carro INT NOT NULL UNIQUE,
      quantidade INT NOT NULL,
      localizacao_patio VARCHAR(100) NOT NULL,
      data_entrada DATE NOT NULL,
      FOREIGN KEY (id_carro) REFERENCES carros(id_carro)
    );
  `;
  }

  // LISTAGEM
  async listaTodos(): Promise<Estoque[]> {
    const linhas = await executarComandoSQL(
      "SELECT id_estoque, id_carro, quantidade, localizacao_patio, data_entrada FROM estoque",
      [],
    );

    return linhas.map((linha: any) => {
      return new Estoque(
        linha.id_estoque,
        linha.id_carro,
        linha.quantidade,
        linha.localizacao_patio,
        new Date(linha.data_entrada),
      );
    });
  }
  // BUSCA POR ID DO ESTOQUE
  async filtraPorId(id: number): Promise<Estoque | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_estoque, id_carro, quantidade, localizacao_patio, data_entrada FROM estoque WHERE id_estoque = ?",
      [id],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Estoque(
      linha.id_estoque,
      linha.id_carro,
      linha.quantidade,
      linha.localizacao_patio,
      new Date(linha.data_entrada),
    );
  }
  // BUSCA POR ID DO CARRO
  async filtraPorIdCarro(id_carro: number): Promise<Estoque | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_estoque, id_carro, quantidade, localizacao_patio, data_entrada FROM estoque WHERE id_carro = ?",
      [id_carro],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Estoque(
      linha.id_estoque,
      linha.id_carro,
      linha.quantidade,
      linha.localizacao_patio,
      new Date(linha.data_entrada),
    );
  }

  // CADASTRO
  async cadastra(estoque: Estoque): Promise<Estoque> {
    const resultado = await executarComandoSQL(
      "INSERT INTO estoque (id_carro, quantidade, localizacao_patio, data_entrada) VALUES (?, ?, ?, ?)",
      [
        estoque.id_carro,
        estoque.quantidade,
        estoque.localizacao_patio,
        estoque.data_entrada,
      ],
    );

    return new Estoque(
      resultado.insertId,
      estoque.id_carro,
      estoque.quantidade,
      estoque.localizacao_patio,
      estoque.data_entrada,
    );
  }

  // ATUALIZAÇÃO
  async atualiza(
    id: number,
    estoqueAtualizado: Estoque,
  ): Promise<Estoque | null> {
    const resultado = await executarComandoSQL(
      "UPDATE estoque SET id_carro = ?, quantidade = ?, localizacao_patio = ?, data_entrada = ? WHERE id_estoque = ?",
      [
        estoqueAtualizado.id_carro,
        estoqueAtualizado.quantidade,
        estoqueAtualizado.localizacao_patio,
        estoqueAtualizado.data_entrada,
        id,
      ],
    );

    if (resultado.affectedRows === 0) {
      return null;
    }

    return new Estoque(
      id,
      estoqueAtualizado.id_carro,
      estoqueAtualizado.quantidade,
      estoqueAtualizado.localizacao_patio,
      estoqueAtualizado.data_entrada,
    );
  }

  // REMOÇÃO
  async remove(id: number): Promise<boolean> {
    const resultado = await executarComandoSQL(
      "DELETE FROM estoque WHERE id_estoque = ?",
      [id],
    );

    return resultado.affectedRows > 0;
  }
}
