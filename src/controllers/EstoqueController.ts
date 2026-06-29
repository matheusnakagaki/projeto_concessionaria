import { Request, Response } from "express";
import { EstoqueService } from "../services/EstoqueService";

const estoqueService = new EstoqueService();

export async function cadastrarEstoque(req: Request, res: Response) {
  try {
    const novoEstoque = await estoqueService.cadastrarEstoque(req.body);
    return res.status(201).json(novoEstoque);
  } catch (error: any) {
    const mensagem = error.message;

    if (mensagem === "Informações obrigatórias incompletas") {
      return res.status(400).json({ mensagem });
    }

    if (mensagem.includes("Carro não encontrado")) {
      return res.status(404).json({ mensagem });
    }

    if (mensagem.includes("Já existe")) {
      return res.status(409).json({ mensagem });
    }

    if (
      mensagem.includes("quantidade") ||
      mensagem.includes("Quantidade") ||
      mensagem.includes("Data")
    ) {
      return res.status(400).json({ mensagem });
    }

    return res.status(400).json({ mensagem });
  }
}

export async function listarEstoques(req: Request, res: Response) {
  const estoques = await estoqueService.listarEstoques();
  return res.status(200).json(estoques);
}

export async function buscarEstoquePorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const estoque = await estoqueService.buscarPorId(id);
    return res.status(200).json(estoque);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}

export async function atualizarEstoque(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const estoqueAtualizado = await estoqueService.atualizarEstoque(
      id,
      req.body,
    );

    return res.status(200).json(estoqueAtualizado);
  } catch (error: any) {
    const mensagem = error.message;

    if (mensagem === "Estoque não encontrado") {
      return res.status(404).json({ mensagem });
    }
    if (mensagem === "Informações obrigatórias incompletas") {
      return res.status(400).json({ mensagem });
    }
    if (mensagem.includes("Quantidade")) {
      return res.status(400).json({ mensagem });
    }
    if (mensagem.includes("Data")) {
      return res.status(400).json({ mensagem });
    }
    return res.status(400).json({ mensagem });
  }
}

export async function removerEstoque(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const estoqueRemovido = await estoqueService.removerEstoque(id);
    return res.status(200).json({ mensagem: "Estoque removido com sucesso!" });
  } catch (error: any) {
    if (error.message.includes("Não é permitido remover"))
      return res.status(422).json({ mensagem: error.message });
    if (error.message === "Estoque não encontrado")
      return res.status(404).json({ mensagem: error.message });
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

export async function buscarEstoquePorCarro(req: Request, res: Response) {
  try {
    const id_carro = parseInt(req.params.id_carro as string);
    const estoque = await estoqueService.buscarEstoquePorCarro(id_carro);
    return res.status(200).json(estoque);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}
