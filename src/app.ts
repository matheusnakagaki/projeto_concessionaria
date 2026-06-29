import express from "express";
import router from "./routes/router";
import { inicializarBanco } from "./database/mysql";


const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(router);

function logInfo() {
  console.log(`API em execucao no URL: http://localhost:${PORT}`);
}
async function startServer() {
  await inicializarBanco();

  app.listen(PORT, logInfo);
}

startServer();