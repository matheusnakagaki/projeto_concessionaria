import { Request, Response } from "express";
import { ClienteService } from "../services/ClienteService";
import { NotaRepository } from "../repositories/NotaRepository";

const clienteService = new ClienteService();
const notaRepository = NotaRepository.getInstance();

export async function cadastrarCliente(req: Request, res: Response) {
  try {
    const novoCliente = await clienteService.cadastrarCliente(req.body);
    return res.status(201).json(novoCliente);
  } catch (error: any) {
    const mensagem = error.message;

    if (mensagem === "Informações obrigatórias incompletas") {
      return res.status(400).json({ mensagem });
    }

    if (mensagem.includes("Já existe")) {
      return res.status(409).json({ mensagem });
    }

    return res.status(400).json({ mensagem });
  }
}

export async function listarClientes(req: Request, res: Response) {
  const clientes = await clienteService.listarClientes();
  return res.status(200).json(clientes);
}

export async function buscarClientePorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const cliente = await clienteService.buscarPorId(id);
    return res.status(200).json(cliente);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}

export async function atualizarCliente(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const clienteAtualizado = await clienteService.atualizarCliente(
      id,
      req.body,
    );
    return res.status(200).json(clienteAtualizado);
  } catch (error: any) {
    const mensagem = error.message;
    if (mensagem === "Cliente não encontrado") {
      return res.status(404).json({ mensagem });
    }
    if (mensagem === "Informações obrigatórias incompletas") {
      return res.status(400).json({ mensagem });
    }
    if (mensagem.includes("Já existe")) {
      return res.status(409).json({ mensagem });
    }
    return res.status(400).json({ mensagem });
  }
}

export async function removerCliente(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    await clienteService.removerCliente(id);
    return res.status(200).json({
      mensagem: "Cliente removido com sucesso!",
    });
  } catch (error: any) {
    const mensagem = error.message;
    if (mensagem === "Cliente não encontrado") {
      return res.status(404).json({ mensagem });
    }
    if (mensagem.includes("Não é permitido remover")) {
      return res.status(422).json({ mensagem });
    }
    return res.status(400).json({ mensagem });
  }
}

export async function listarNotasDoCliente(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const notas = await notaRepository.filtraNotaPorIdCliente(id);
    return res.status(200).json(notas);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}
