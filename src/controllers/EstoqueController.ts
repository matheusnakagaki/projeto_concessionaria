import { Request, Response } from "express";
import { EstoqueService } from "../services/EstoqueService";

const estoqueService = new EstoqueService();

export function cadastrarEstoque(req: Request, res: Response) {
  try {
    const novoEstoque = estoqueService.cadastrarEstoque(req.body);
    res.status(201).json({
      mensagem: "Estoque cadastrado com sucesso!",
      estoque: novoEstoque,
    });
  } catch (error: any) {
    const mensagem = error.message;

    if (mensagem === "Informações obrigatórias incompletas") {
      return res.status(400).json({ mensagem: error.message });
    }

    if (mensagem.includes("Já existe")) {
      return res.status(409).json({ mensagem: error.message });
    }

    if (mensagem.includes("Carro não encontrado")) {
      return res.status(404).json({ mensagem });
    }
  }
}

export function listarEstoques(req: Request, res: Response) {
  const estoques = estoqueService.listarEstoques();
  return res.status(200).json(estoques);
}

export function buscarPorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const estoque = estoqueService.buscarPorId(id);
    return res.status(200).json(estoque);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}

export function atualizarEstoque(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const estoqueAtualizado = estoqueService.atualizarEstoque(id, req.body);
    return res.status(200).json(estoqueAtualizado);
  } catch (error: any) {
    if (error.message === "Estoque não encontrado")
      return res.status(404).json({ mensagem: error.message });
    return res.status(400).json({ mensagem: error.message });
  }
}

export function removerEstoque(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    estoqueService.removerEstoque(id);
    return res.status(200).json({ mensagem: "Estoque removido com sucesso!" });
  } catch (error: any) {
    if (error.message.includes("Não é permitido remover"))
      return res.status(422).json({ mensagem: error.message });
    if (error.message === "Estoque não encontrado")
      return res.status(404).json({ mensagem: error.message });
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

export function buscarPorIdCarro(req: Request, res: Response) {
  try {
    const idCarro = parseInt(req.params.idCarro as string);
    const estoque = estoqueService.buscarEstoquePorCarro(idCarro);
    
    return res.status(200).json(estoque);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}
