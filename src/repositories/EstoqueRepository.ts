import { Estoque } from "../models/Estoque";

export class EstoqueRepository {
  private static instance: EstoqueRepository;
  private estoqueCompleto: Estoque[] = [];

  private constructor() {}

  public static getInstance(): EstoqueRepository {
    if (!this.instance) {
      this.instance = new EstoqueRepository();
    }
    return this.instance;
  }

  // LISTAGEM
  listaTodos(): Estoque[] {
    return this.estoqueCompleto;
  }

  // BUSCA POR ID DO ESTOQUE
  filtraPorId(id: number): Estoque | undefined {
    return this.estoqueCompleto.find((estoque) => estoque.id_estoque === id);
  }

  // BUSCA POR ID DO CARRO 
  filtraPorIdCarro(id_carro: number): Estoque | undefined {
    return this.estoqueCompleto.find((estoque) => estoque.id_carro === id_carro);
  }

  // CADASTRO
  cadastra(estoque: Estoque): void {
    this.estoqueCompleto.push(estoque);
  }

  // ATUALIZAÇÃO 
  atualiza(id: number, dadosNovos: any): boolean {
    const estoque = this.filtraPorId(id);

    if (estoque) {
      if (dadosNovos.quantidade !== undefined) estoque.quantidade = dadosNovos.quantidade;
      if (dadosNovos.localizacao_patio) estoque.localizacao_patio = dadosNovos.localizacao_patio;
      return true;
    }
    return false;
  }

  // REMOÇÃO
  remove(id: number): void {
    const index = this.estoqueCompleto.findIndex((e) => e.id_estoque === id);
    if (index !== -1) {
      this.estoqueCompleto.splice(index, 1);
    }
  }
}