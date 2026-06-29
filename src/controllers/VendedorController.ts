import { Request, Response } from "express";
import { VendedorService } from "../services/VendedorService";
import { NotaRepository } from "../repositories/NotaRepository";

const vendedorService = new VendedorService();
const notaRepository = NotaRepository.getInstance();

export async function cadastrarVendedor(req: Request, res: Response) {
  try {
    const novoVendedor = await vendedorService.cadastrarVendedor(req.body);
    res.status(201).json({
      novoVendedor,
    });
  } catch (error: any) {
    const mensagem = error.message;
    if (mensagem === "Informações obrigatórias incompletas") {
      return res.status(400).json({ mensagem: error.message });
    }
    if (mensagem.includes("Já existe")) {
      return res.status(409).json({ mensagem: error.message });
    }
    if (mensagem.includes("Percentual de Comissão")) {
      return res.status(400).json({ mensagem: error.message });
    }
    return res.status(400).json({ mensagem });
  }
}

export async function listarVendedores(req: Request, res: Response) {
  const vendedores = await vendedorService.listarVendedores();
  return res.status(200).json(vendedores);
}

export async function buscarVendedorPorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const vendedor = await vendedorService.buscarPorId(id);
    return res.status(200).json(vendedor);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}

export async function atualizarVendedor(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const vendedorAtualizado = await vendedorService.atualizarVendedor(
      id,
      req.body,
    );

    return res.status(200).json(vendedorAtualizado);
  } catch (error: any) {
    const mensagem = error.message;

    if (mensagem === "Vendedor não encontrado") {
      return res.status(404).json({ mensagem });
    }
    if (mensagem === "Informações obrigatórias incompletas") {
      return res.status(400).json({ mensagem });
    }
    if (mensagem.includes("Já existe")) {
      return res.status(409).json({ mensagem });
    }
    if (mensagem.includes("Comissão") || mensagem.includes("comissão")) {
      return res.status(400).json({ mensagem });
    }

    return res.status(400).json({ mensagem });
  }
}

export async function removerVendedor(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const vendedorRemovido = await vendedorService.removerVendedor(id);

    return res.status(200).json(vendedorRemovido);
  } catch (error: any) {
    const mensagem = error.message;
    if (mensagem === "Vendedor não encontrado") {
      return res.status(404).json({ mensagem });
    }
    if (mensagem.includes("Não é permitido remover")) {
      return res.status(422).json({ mensagem });
    }
    return res.status(400).json({ mensagem });
  }
}

export async function listarNotasDoVendedor(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const notas = await notaRepository.filtraNotaPorIdVendedor(id);
    return res.status(200).json(notas);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}
