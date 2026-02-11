// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());           // permette al frontend di fare richieste
app.use(express.json());   // permette di leggere JSON dal body

// utenti di esempio
const utenti = [
  { username: "mario", password: "1234", ruolo: "dipendente", comparto: "rimessa", nome: "Mario" },
  { username: "lucia", password: "1234", ruolo: "dipendente", comparto: "autisti", nome: "Lucia" },
  { username: "gianni", password: "1234", ruolo: "dipendente", comparto: "amministrativi", nome: "Gianni" },
  { username: "Christian", password: "1234", ruolo: "admin" }
];

// login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const utente = utenti.find(u => u.username === username && u.password === password);

  if (!utente) {
    return res.status(401).json({ error: "Credenziali errate" });
  }

  const { ruolo, comparto, nome } = utente;
  res.json({ username, ruolo, comparto: comparto || null, nome: nome || null });
});

// test root
app.get("/", (req, res) => {
  res.send("Backend ferie attivo!");
});

app.listen(PORT, () => {
  console.log(`Backend ferie attivo sulla porta ${PORT}`);
});
