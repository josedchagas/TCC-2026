import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./db/index.js";
import { sql } from "drizzle-orm";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota simples só pra confirmar que o servidor está de pé.
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API do RPG rodando" });
});

// Rota que testa a conexão de verdade com o banco no Neon.
app.get("/health/db", async (req, res) => {
  try {
    await db.execute(sql`select 1`);
    res.json({ database: "conectado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ database: "erro ao conectar", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});