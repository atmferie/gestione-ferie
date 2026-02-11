const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

const utenti = [
  { username: "mario",  password: "1234",  ruolo: "dipendente", comparto: "autisti",         nome: "Mario Rossi" },
  { username: "anna",   password: "1234",  ruolo: "dipendente", comparto: "amministrativi", nome: "Anna Verdi" },
  { username: "gianni", password: "1234",  ruolo: "dipendente", comparto: "rimessa",        nome: "Gianni Bianchi" },
  { username: "admin",  password: "admin", ruolo: "admin",     nome: "Admin" },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Username e password richiesti" });

  const utente = utenti.find((u) => u.username === username && u.password === password);
  if (!utente) return res.status(401).json({ error: "Credenziali errate" });

  return res.json(utente);
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(port, () => console.log(`✅ Backend attivo su http://localhost:${port}`));
