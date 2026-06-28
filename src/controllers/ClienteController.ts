import { Request, Response } from "express";
import { ClienteService } from "../services/ClienteService";
import { NotaRepository } from "../repositories/NotaRepository";

const clienteService = new ClienteService();
const notaRepository = NotaRepository.getInstance();

export function cadastrarCliente(req: Request, res: Response) {
  try {
    const novoCliente = clienteService.cadastrarCliente(req.body);
    res.status(201).json({
      cliente: novoCliente,
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

export function listarClientes(req: Request, res: Response) {
  const clientes = clienteService.listarClientes();
  return res.status(200).json(clientes);
}

export function buscarClientePorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const cliente = clienteService.buscarPorId(id);
    return res.status(200).json(cliente);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
}

export function atualizarCliente(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const clienteAtualizado = clienteService.atualizarCliente(id, req.body);
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

export function removerCliente(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    clienteService.removerCliente(id);
    return res.status(200).json({ mensagem: "Cliente removido com sucesso!" });
  } catch (error: any) {
    if (error.message.includes("Não é permitido remover"))
      return res.status(422).json({ mensagem: error.message });
    if (error.message === "Cliente não encontrado")
      return res.status(404).json({ mensagem: error.message });
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

export function listarNotasDoCliente(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const notas = notaRepository.filtraNotaPorIdCliente(id);
    return res.status(200).json(notas);
  } catch (error: any) {
    return res
      .status(500)
      .json({ mensagem: "Erro ao buscar notas do cliente" });
  }
}
