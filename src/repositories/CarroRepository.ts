import { Carro } from "../models/Carro";

export class CarroRepository {
  private static instance: CarroRepository;
  private carros: Carro[] = [];

  private constructor() {}

  public static getInstance(): CarroRepository {
    if (!this.instance) {
      this.instance = new CarroRepository();
    }
    return this.instance;
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
