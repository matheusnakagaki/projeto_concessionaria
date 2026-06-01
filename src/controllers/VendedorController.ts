import { Request, Response } from "express";
import { VendedorService } from "../services/VendedorService";
import { NotaRepository } from "../repositories/NotaRepository";

const vendedorService = new VendedorService();
const notaRepository = NotaRepository.getInstance();

export function cadastrarVendedor(req: Request, res: Response) {
  try {
    const novoVendedor = vendedorService.cadastrarVendedor(req.body);
    res.status(201).json({
      mensagem: "Vendedor cadastrado com sucesso!",
      vendedor: novoVendedor,
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

export function listarVendedores(req: Request, res: Response) {
  const vendedores = vendedorService.listarVendedores();
  return res.status(200).json(vendedores);
}

export function buscarPorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const vendedor = vendedorService.buscarPorId(id);
    return res.status(200).json(vendedor);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}

export function atualizarVendedor(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const vendedorAtualizado = vendedorService.atualizarVendedor(id, req.body);
    return res.status(200).json(vendedorAtualizado);
  } catch (error: any) {
    if (error.message === "Vendedor não encontrado") return res.status(404).json({ mensagem: error.message });
    return res.status(400).json({ mensagem: error.message });
  }
}

export function removerVendedor(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    vendedorService.removerVendedor(id);
    return res.status(200).json({ mensagem: "Vendedor removido com sucesso!" });
  } catch (error: any) {
    if (error.message.includes("Não é permitido remover")) return res.status(422).json({ mensagem: error.message });
    if (error.message === "Vendedor não encontrado") return res.status(404).json({ mensagem: error.message });
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

export function listarNotasDoVendedor(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const notas = notaRepository.filtraNotaPorIdVendedor(id);
    return res.status(200).json(notas);
  } catch (error: any) {
    return res.status(500).json({ mensagem: "Erro ao buscar notas do vendedor" });
  }
}