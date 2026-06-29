import mysql, { Connection, QueryError } from "mysql2";
import dotenv from "dotenv";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { VendedorRepository } from "../repositories/VendedorRepository";

dotenv.config();

const databaseName = process.env.DB_NAME || "concessionaria";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "mysql",
};

const mysqlConnection: Connection = mysql.createConnection(dbConfig);

mysqlConnection.connect((err: QueryError | null) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    throw err;
  }

  console.log("Conexão bem-sucedida com o banco de dados MySQL");
});

export function executarComandoSQL(
  query: string,
  valores: any[],
): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    mysqlConnection.query(query, valores, (err, resultado) => {
      if (err) {
        console.error("Erro ao executar a query.", err);
        reject(err);
        return;
      }

      resolve(resultado);
    });
  });
}

export async function inicializarBanco(): Promise<void> {
  console.log("Sincronizando schemas do banco de dados...");

  try {
    await executarComandoSQL(
      `CREATE DATABASE IF NOT EXISTS ${databaseName}`,
      [],
    );

    await executarComandoSQL(`USE ${databaseName}`, []);

    const schemas = [
      ClienteRepository.getCreateTableQuery(),
      VendedorRepository.getCreateTableQuery(),
    ];

    for (const query of schemas) {
      await executarComandoSQL(query, []);
    }

    console.log(`Conectado ao schema: ${databaseName}`);
    console.log("Banco de dados inicializado com sucesso.");
  } catch (err) {
    console.error("Erro crítico na inicialização do banco:", err);
    process.exit(1);
  }
}
