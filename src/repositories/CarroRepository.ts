import { Carro } from "../models/Carro";
import { executarComandoSQL } from "../database/mysql";

export class CarroRepository {
  private static instance: CarroRepository;

  private constructor() {}

  public static getInstance(): CarroRepository {
    if (!this.instance) {
      this.instance = new CarroRepository();
    }
    return this.instance;
  }

  static getCreateTableQuery(): string {
    return `
    CREATE TABLE IF NOT EXISTS carros (
      id_carro INT AUTO_INCREMENT PRIMARY KEY,
      marca VARCHAR(100) NOT NULL,
      modelo VARCHAR(100) NOT NULL,
      ano INT NOT NULL,
      placa VARCHAR(20) NOT NULL UNIQUE,
      preco DECIMAL(10,2) NOT NULL,
      cor VARCHAR(50) NOT NULL
    );
  `;
  }

  // LISTAGEM
  async listaTodos(): Promise<Carro[]> {
    const linhas = await executarComandoSQL(
      "SELECT id_carro, marca, modelo, ano, placa, preco, cor FROM carros",
      [],
    );

    return linhas.map((linha: any) => {
      return new Carro(
        linha.id_carro,
        linha.marca,
        linha.modelo,
        linha.ano,
        linha.placa,
        Number(linha.preco),
        linha.cor,
      );
    });
  }

  // BUSCA
  async filtraPorId(id: number): Promise<Carro | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_carro, marca, modelo, ano, placa, preco, cor FROM carros WHERE id_carro = ?",
      [id],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Carro(
      linha.id_carro,
      linha.marca,
      linha.modelo,
      linha.ano,
      linha.placa,
      Number(linha.preco),
      linha.cor,
    );
  }

  // CADASTRO
  async cadastra(carro: Carro): Promise<Carro> {
    const resultado = await executarComandoSQL(
      "INSERT INTO carros (marca, modelo, ano, placa, preco, cor) VALUES (?, ?, ?, ?, ?, ?)",
      [
        carro.marca,
        carro.modelo,
        carro.ano,
        carro.placa,
        carro.preco,
        carro.cor,
      ],
    );

    return new Carro(
      resultado.insertId,
      carro.marca,
      carro.modelo,
      carro.ano,
      carro.placa,
      carro.preco,
      carro.cor,
    );
  }

  // ATUALIZAÇÃO
  async atualiza(id: number, carroAtualizado: Carro): Promise<Carro | null> {
    const resultado = await executarComandoSQL(
      "UPDATE carros SET marca = ?, modelo = ?, ano = ?, placa = ?, preco = ?, cor = ? WHERE id_carro = ?",
      [
        carroAtualizado.marca,
        carroAtualizado.modelo,
        carroAtualizado.ano,
        carroAtualizado.placa,
        carroAtualizado.preco,
        carroAtualizado.cor,
        id,
      ],
    );

    if (resultado.affectedRows === 0) {
      return null;
    }

    return new Carro(
      id,
      carroAtualizado.marca,
      carroAtualizado.modelo,
      carroAtualizado.ano,
      carroAtualizado.placa,
      carroAtualizado.preco,
      carroAtualizado.cor,
    );
  }

  // REMOÇÃO
  async remove(id: number): Promise<boolean> {
    const resultado = await executarComandoSQL(
      "DELETE FROM carros WHERE id_carro = ?",
      [id],
    );

    return resultado.affectedRows > 0;
  }

  // FILTRO INTERNO (RN03) -> Validação acontece na camada de serviço
  async filtraPorPlaca(placa: string): Promise<Carro | null> {
    const linhas = await executarComandoSQL(
      "SELECT id_carro, marca, modelo, ano, placa, preco, cor FROM carros WHERE placa = ?",
      [placa],
    );

    if (linhas.length === 0) {
      return null;
    }

    const linha = linhas[0];

    return new Carro(
      linha.id_carro,
      linha.marca,
      linha.modelo,
      linha.ano,
      linha.placa,
      Number(linha.preco),
      linha.cor,
    );
  }
}
