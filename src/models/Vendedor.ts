export class Vendedor {
  constructor(
    public id_vendedor: number | null,
    public nome: string,
    public matricula: string,
    public comissao_percentual: number
  ) {}
}
