import { Router } from "express";

import { listarClientes,  buscarClientePorId, cadastrarCliente, atualizarCliente, removerCliente, listarNotasDoCliente } from "../controllers/ClienteController";
import { listarVendedores, buscarVendedorPorId, cadastrarVendedor, atualizarVendedor, removerVendedor, listarNotasDoVendedor } from "../controllers/VendedorController";
import { listarCarros, buscarCarroPorId, cadastrarCarro, atualizarCarro, removerCarro, listarCarrosDisponiveis   } from "../controllers/CarroController";
import { listarEstoques, buscarEstoquePorId, buscarEstoquePorCarro, cadastrarEstoque, atualizarEstoque, removerEstoque  } from "../controllers/EstoqueController";
import { listarNotas, buscarNotaPorId, cadastrarNota, removerNota } from "../controllers/NotaController";

const router = Router();

// Rotas do Cliente
router.get("/clientes", listarClientes);
router.get("/clientes/notas/:id", listarNotasDoCliente);
router.get("/clientes/:id", buscarClientePorId);
router.post("/clientes", cadastrarCliente);
router.put("/clientes/:id", atualizarCliente);
router.delete("/clientes/:id", removerCliente);

// Rotas do Vendedor
router.get("/vendedores", listarVendedores);
router.get("/vendedores/notas/:id", listarNotasDoVendedor);
router.get("/vendedores/:id", buscarVendedorPorId);
router.post("/vendedores", cadastrarVendedor);
router.put("/vendedores/:id", atualizarVendedor);
router.delete("/vendedores/:id", removerVendedor);

// Rotas do Carro
router.get("/carros", listarCarros);
router.get("/carros/disponiveis", listarCarrosDisponiveis);
router.get("/carros/:id", buscarCarroPorId);
router.post("/carros", cadastrarCarro);
router.put("/carros/:id", atualizarCarro);
router.delete("/carros/:id", removerCarro);

// Rotas do Estoque
router.get("/estoque", listarEstoques);
router.get("/estoque/carro/:id_carro", buscarEstoquePorCarro);
router.get("/estoque/:id", buscarEstoquePorId);
router.post("/estoque", cadastrarEstoque);
router.put("/estoque/:id", atualizarEstoque);
router.delete("/estoque/:id", removerEstoque);

// Rotas de NF
router.get("/notas", listarNotas);
router.get("/notas/:id", buscarNotaPorId);
router.post("/notas", cadastrarNota);
router.delete("/notas/:id", removerNota);

export default router;