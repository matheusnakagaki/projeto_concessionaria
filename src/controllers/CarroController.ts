import { Request, Response } from "express";
import { CarroService } from "../services/CarroService";

const carroService = new CarroService();

export async function cadastrarCarro(req: Request, res: Response) {
  try {
    const novoCarro = await carroService.cadastrarCarro(req.body);
    res.status(201).json({
      carro: novoCarro,
    });
  } catch (error: any) {
    const mensagem = error.message;
    if (mensagem === "Informações obrigatórias incompletas") {
      return res.status(400).json({ mensagem: error.message });
    }
    if (mensagem.includes("Já existe")) {
      return res.status(409).json({ mensagem: error.message });
    }
    if (mensagem.includes("Ano não permitido")) {
      return res.status(400).json({ mensagem: error.message });
    }
    if (mensagem.includes("O valor do carro")) {
      return res.status(400).json({ mensagem: error.message });
    }
  }
}

export async function listarCarros(req: Request, res: Response) {
  const disponivel = req.query.disponivel;

  if (disponivel === "true") {
    const carrosDisponiveis = await carroService.listarCarrosDisponiveis();
    return res.status(200).json(carrosDisponiveis);
  }

  const todos = await carroService.listarCarros();
  return res.status(200).json(todos);
}

export async function buscarCarroPorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const carro = await carroService.buscarPorId(id);
    return res.status(200).json(carro);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}

export async function atualizarCarro(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const carroAtualizado = await carroService.atualizarCarro(id, req.body);
    return res.status(200).json(carroAtualizado);
  } catch (error: any) {
    const mensagem = error.message;

    if (mensagem === "Carro não encontrado") {
      return res.status(404).json({ mensagem });
    }
    if (mensagem === "Informações obrigatórias incompletas") {
      return res.status(400).json({ mensagem });
    }
    if (mensagem.includes("Já existe")) {
      return res.status(409).json({ mensagem });
    }
    if (
      mensagem.includes("Ano") ||
      mensagem.includes("Preço") ||
      mensagem.includes("preço")
    ) {
      return res.status(400).json({ mensagem });
    }
    return res.status(400).json({ mensagem });
  }
}

export async function removerCarro(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const carroRemovido = await carroService.removerCarro(id);
    return res.status(200).json({
      mensagem: "Carro removido com sucesso!",
    });
  } catch (error: any) {
    const mensagem = error.message;
    if (mensagem === "Carro não encontrado") {
      return res.status(404).json({ mensagem });
    }
    if (mensagem.includes("Não é permitido remover")) {
      return res.status(422).json({ mensagem });
    }
    return res.status(400).json({ mensagem });
  }
}

export async function listarCarrosDisponiveis(req: Request, res: Response) {
  const carros = await carroService.listarCarrosDisponiveis();
  return res.status(200).json(carros);
}
