import { Request, Response } from "express";
import { NotaService } from "../services/NotaService";

const notaService = new NotaService();

export function cadastrarNota(req: Request, res: Response) {
  try {
    const novaNota = notaService.cadastrarNota(req.body);
    res.status(201).json({
      nota: novaNota,
    });
  } catch (error: any) {
    const mensagem = error.message;
    if (
      mensagem === "Informações obrigatórias incompletas" ||
      mensagem === "Data de emissão não pode ser futura" ||
      mensagem === "O valor da nota deve ser maior que zero"
    ) {
      return res.status(400).json({ mensagem });
    }
    if (
      mensagem === "Cliente não encontrado" ||
      mensagem === "Vendedor não encontrado" ||
      mensagem === "Carro não encontrado"
    ) {
      return res.status(404).json({ mensagem });
    }
    if (mensagem.includes("Já existe")) {
      return res.status(409).json({ mensagem });
    }
    if (mensagem === "Carro indisponível em estoque") {
      return res.status(422).json({ mensagem });
    }
    return res.status(400).json({ mensagem });
  }
}

export function listarNotas(req: Request, res: Response) {
  const notas = notaService.listarNotas();
  return res.status(200).json(notas);
}

export function buscarNotaPorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const nota = notaService.buscarPorId(id);
    return res.status(200).json(nota);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}
