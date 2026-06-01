import express from "express";
import { listarClientes,  buscarClientePorId, cadastrarCliente, atualizarCliente, removerCliente, listarNotasDoCliente } from "./controllers/ClienteController";
import { listarVendedores, buscarVendedorPorId, cadastrarVendedor, atualizarVendedor, removerVendedor, listarNotasDoVendedor } from "./controllers/VendedorController";
import { listarCarros, buscarCarroPorId, cadastrarCarro, atualizarCarro, removerCarro   } from "./controllers/CarroController";
import { listarEstoques, buscarEstoquePorId, buscarEstoquePorIdCarro, cadastrarEstoque, atualizarEstoque, removerEstoque  } from "./controllers/EstoqueController";
import { listarNotas, buscarNotaPorId, cadastrarNota } from "./controllers/NotaController";


const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

function logInfo() {
  console.log(`API em execucao no URL: http://localhost:${PORT}`);
}

// Rotas do Cliente
app.get("/api/clientes", listarClientes);
app.get("/api/clientes/:id", buscarClientePorId);
app.post("/api/clientes", cadastrarCliente);
app.put("/api/clientes/:id", atualizarCliente);
app.delete("/api/clientes/:id", removerCliente);
app.get("/api/clientes/notas/:id", listarNotasDoCliente);

// Rotas do Vendedor
app.get("/api/vendedores", listarVendedores);
app.get("/api/vendedores/:id", buscarVendedorPorId);
app.post("/api/vendedores", cadastrarVendedor);
app.put("/api/vendedores/:id", atualizarVendedor);
app.delete("/api/vendedores/:id", removerVendedor);
app.get("/api/vendedores/notas/:id", listarNotasDoVendedor);

// Rotas do Carro
app.get("/api/carros", listarCarros);
app.get("/api/carros/:id", buscarCarroPorId);
app.get("/api/carros/disponiveis", listarCarros);
app.post("/api/carros", cadastrarCarro);
app.put("/api/carros/:id", atualizarCarro);
app.delete("/api/carros/:id", removerCarro);

// Rotas do Estoque
app.get("/api/estoque", listarEstoques);
app.get("/api/estoque/:id", buscarEstoquePorId);
app.get("/api/estoque/carro/:id_carro", buscarEstoquePorIdCarro);
app.post("/api/estoque", cadastrarEstoque);
app.put("/api/estoque/:id", atualizarEstoque);
app.delete("/api/estoque/:id", removerEstoque);

// Rotas de NF
app.get("/api/notas", listarNotas);
app.get("/api/notas/:id", buscarNotaPorId);
app.post("/api/notas", cadastrarNota);

app.listen(PORT, logInfo);
