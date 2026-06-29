export class Cliente {
  id_cliente: number | null;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string | null;
  cidade?: string | null;

  constructor(
    id_cliente: number | null,
    nome: string,
    cpf: string,
    telefone: string,
    email?: string | null,
    cidade?: string | null,
  ) {
    this.id_cliente = id_cliente;
    this.nome = nome;
    this.cpf = cpf;
    this.telefone = telefone;
    this.email = email;
    this.cidade = cidade;
  }
}