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
  atualiza(id: number, dadosNovos: any): boolean {
    const carro = this.filtraPorId(id);

    if (carro) {
      if (dadosNovos.marca) carro.marca = dadosNovos.marca;
      if (dadosNovos.modelo) carro.modelo = dadosNovos.modelo;
      if (dadosNovos.ano) carro.ano = dadosNovos.ano;
      if (dadosNovos.placa) carro.placa = dadosNovos.placa;
      if (dadosNovos.preco) carro.preco = dadosNovos.preco;
      if (dadosNovos.cor) carro.cor = dadosNovos.cor;
      return true;
    }
    return false;
  }

  // REMOÇÃO
  remove(id: number): void {
    const index = this.carros.findIndex((c) => c.id_carro === id);
    if (index !== -1) {
      this.carros.splice(index, 1);
    }
  }

  // FILTRO INTERNO (RN03) -> Validação acontece na camada de serviço
  filtraPorPlaca(placa: string): Carro | undefined {
    return this.carros.find((carro) => carro.placa === placa);
  }
}