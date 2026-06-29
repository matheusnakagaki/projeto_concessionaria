import { Carro } from "../models/Carro";
import { executarComandoSQL } from "../database/mysql";

export class CarroRepository {
  private static instance: CarroRepository;
  private carros: Carro[] = [];
  private proximoId: number = 1;

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

  gerarProximoId(): number {
    return this.proximoId++;
  }

  // LISTAGEM
  listaTodos(): Carro[] {
    return this.carros;
  }

  // BUSCA
  filtraPorId(id: number): Carro | undefined {
    return this.carros.find((carro) => carro.id_carro === id);
  }

  // CADASTRO
  cadastra(carro: Carro): void {
    this.carros.push(carro);
  }

  // ATUALIZAÇÃO
  atualiza(id: number, carroAtualizado: Carro): boolean {
    const index = this.carros.findIndex((carro) => carro.id_carro === id);
    if (index !== -1) {
      this.carros[index] = carroAtualizado;
      return true;
    }
    return false;
  }

  // REMOÇÃO
  remove(id: number): void {
    const index = this.carros.findIndex((carro) => carro.id_carro === id);
    if (index !== -1) {
      this.carros.splice(index, 1);
    }
  }

  // FILTRO INTERNO (RN03) -> Validação acontece na camada de serviço
  filtraPorPlaca(placa: string): Carro | undefined {
    return this.carros.find((carro) => carro.placa === placa);
  }
}
