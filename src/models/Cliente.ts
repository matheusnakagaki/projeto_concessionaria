export class Cliente {
  constructor(
    public id_cliente: number | null,
    public nome: string,
    public cpf: string,
    public telefone: string,
    public email?: string,
    public cidade?: string
  ) {}
}