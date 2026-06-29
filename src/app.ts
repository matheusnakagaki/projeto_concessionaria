import express from "express";
import { listarClientes,  buscarClientePorId, cadastrarCliente, atualizarCliente, removerCliente, listarNotasDoCliente } from "./controllers/ClienteController";
import { listarVendedores, buscarVendedorPorId, cadastrarVendedor, atualizarVendedor, removerVendedor, listarNotasDoVendedor } from "./controllers/VendedorController";
import { listarCarros, buscarCarroPorId, cadastrarCarro, atualizarCarro, removerCarro, listarCarrosDisponiveis   } from "./controllers/CarroController";
import { listarEstoques, buscarEstoquePorId, buscarEstoquePorCarro, cadastrarEstoque, atualizarEstoque, removerEstoque  } from "./controllers/EstoqueController";
import { listarNotas, buscarNotaPorId, cadastrarNota } from "./controllers/NotaController";
import { inicializarBanco } from "./database/mysql";


const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

function logInfo() {
  console.log(`API em execucao no URL: http://localhost:${PORT}`);
}

// Rotas do Cliente
app.get("/clientes", listarClientes);
app.get("/clientes/notas/:id", listarNotasDoCliente);  // ← estática antes
app.get("/clientes/:id", buscarClientePorId);
app.post("/clientes", cadastrarCliente);
app.put("/clientes/:id", atualizarCliente);
app.delete("/clientes/:id", removerCliente);

// Rotas do Vendedor
app.get("/vendedores", listarVendedores);
app.get("/vendedores/notas/:id", listarNotasDoVendedor); // ← estática antes
app.get("/vendedores/:id", buscarVendedorPorId);
app.post("/vendedores", cadastrarVendedor);
app.put("/vendedores/:id", atualizarVendedor);
app.delete("/vendedores/:id", removerVendedor);

// Rotas do Carro
app.get("/carros", listarCarros);
app.get("/carros/disponiveis", listarCarrosDisponiveis); // ← estática antes
app.get("/carros/:id", buscarCarroPorId);
app.post("/carros", cadastrarCarro);
app.put("/carros/:id", atualizarCarro);
app.delete("/carros/:id", removerCarro);

// Rotas do Estoque
app.get("/estoque", listarEstoques);
app.get("/estoque/carro/:id_carro", buscarEstoquePorCarro); // ← estática antes
app.get("/estoque/:id", buscarEstoquePorId);
app.post("/estoque", cadastrarEstoque);
app.put("/estoque/:id", atualizarEstoque);
app.delete("/estoque/:id", removerEstoque);

// Rotas de NF
app.get("/notas", listarNotas);
app.get("/notas/:id", buscarNotaPorId);
app.post("/notas", cadastrarNota);

async function startServer() {
  await inicializarBanco();

  app.listen(PORT, logInfo);
}

startServer();