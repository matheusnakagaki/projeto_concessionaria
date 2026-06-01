import { Vendedor } from "../models/Vendedor";

export class VendedorRepository {
  private static instance: VendedorRepository;
  private vendedores: Vendedor[] = [];

  private constructor() {}

  public static getInstance(): VendedorRepository {
    if (!this.instance) {
      this.instance = new VendedorRepository();
    }
    return this.instance;
  }

  // LISTAGEM
  listaTodos(): Vendedor[] {
    return this.vendedores;
  }

  // BUSCA
  filtraPorId(id: number): Vendedor | undefined {
    return this.vendedores.find((vendedor) => vendedor.id_vendedor === id);
  }

  // CADASTRO
  cadastra(vendedor: Vendedor): void {
    this.vendedores.push(vendedor);
  }

  // ATUALIZAÇÃO 
  atualiza(id: number, dadosNovos: any): boolean {
    const vendedor = this.filtraPorId(id);

    if (vendedor) {
      if (dadosNovos.nome) vendedor.nome = dadosNovos.nome;
      if (dadosNovos.matricula) vendedor.matricula = dadosNovos.matricula;
      if (dadosNovos.comissao_percentual) vendedor.comissao_percentual = dadosNovos.comissao_percentual;
      return true;
    }
    return false;
  }

  // REMOÇÃO
  remove(id: number): void {
    const index = this.vendedores.findIndex((vendedor) => vendedor.id_vendedor === id);
    if (index !== -1) {
      this.vendedores.splice(index, 1);
    }
  }

  // FILTRO INTERNO (RN02) -> Validação acontece na camada de serviço
  filtraPorMatricula(matricula: string): Vendedor | undefined {
    return this.vendedores.find((vendedor) => vendedor.matricula === matricula);
  }
}
