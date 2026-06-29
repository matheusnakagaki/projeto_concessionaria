export class Estoque {
  constructor(
    public id_estoque: number | null,
    public id_carro: number,
    public quantidade: number,
    public localizacao_patio: string,
    public data_entrada: Date,
  ) {}
}
