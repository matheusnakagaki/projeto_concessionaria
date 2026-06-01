import { Request, Response } from "express";
import { CarroService } from "../services/CarroService";

const carroService = new CarroService();

export function cadastrarCarro(req: Request, res: Response) {
  try {
    const novoCarro = carroService.cadastrarCarro(req.body);
    res.status(201).json({
      mensagem: "Carro cadastrado com sucesso!",
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
  }
}

export function listarCarros(req: Request, res: Response) {
  const disponivel = req.query.disponivel;

  if (disponivel === "true") {
    const carrosDisponiveis = carroService.listarCarrosDisponiveis();
    return res.status(200).json(carrosDisponiveis);
  }

  const todos = carroService.listarCarros();
  return res.status(200).json(todos);
}

export function buscarCarroPorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const carro = carroService.buscarPorId(id);
    return res.status(200).json(carro);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}

export function atualizarCarro(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const carroAtualizado = carroService.atualizarCarro(id, req.body);
    return res.status(200).json(carroAtualizado);
  } catch (error: any) {
    if (error.message === "Carro não encontrado")
      return res.status(404).json({ mensagem: error.message });
    return res.status(400).json({ mensagem: error.message });
  }
}

export function removerCarro(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    carroService.removerCarro(id);
    return res.status(200).json({ mensagem: "Carro removido com sucesso!" });
  } catch (error: any) {
    if (error.message.includes("Não é permitido remover"))
      return res.status(422).json({ mensagem: error.message });
    if (error.message === "Carro não encontrado")
      return res.status(404).json({ mensagem: error.message });
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}