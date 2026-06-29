import { Vendedor } from "../models/Vendedor";

export class VendedorRepository {
  private static instance: VendedorRepository;
  private vendedores: Vendedor[] = [];
  private proximoId: number = 1;

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

  gerarProximoId(): number {
    return this.proximoId++;
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
  atualiza(id: number, vendedorAtualizado: Vendedor): boolean {
    const index = this.vendedores.findIndex((vendedor) => vendedor.id_vendedor === id);
    if (index !== -1) {
      this.vendedores[index] = vendedorAtualizado;
      return true;
    }
    return false;
  }

  // REMOÇÃO
  remove(id: number): void {
    const index = this.vendedores.findIndex(
      (vendedor) => vendedor.id_vendedor === id,
    );
    if (index !== -1) {
      this.vendedores.splice(index, 1);
    }
  }

  // FILTRO INTERNO (RN02) -> Validação acontece na camada de serviço
  filtraPorMatricula(matricula: string): Vendedor | undefined {
    return this.vendedores.find((vendedor) => vendedor.matricula === matricula);
  }
}
