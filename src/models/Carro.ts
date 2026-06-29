export class Carro {
  constructor(
    public id_carro: number | null,
    public marca: string,
    public modelo: string,
    public ano: number,
    public placa: string,
    public preco: number,
    public cor: string
  ) {}
}
