const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const port = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// =====================
// UTENTI DEMO
// =====================
const utenti = [
  // AUTISTI (max 5 approvate al giorno)
  { username: "mario", password: "1234", ruolo: "dipendente", comparto: "autisti", nome: "Mario Rossi" },
  { username: "anna", password: "1234", ruolo: "dipendente", comparto: "autisti", nome: "Anna Verdi" },
  { username: "luca", password: "1234", ruolo: "dipendente", comparto: "autisti", nome: "Luca Bianchi" },
  { username: "sara", password: "1234", ruolo: "dipendente", comparto: "autisti", nome: "Sara Neri" },
  { username: "enzo", password: "1234", ruolo: "dipendente", comparto: "autisti", nome: "Enzo Russo" },
  { username: "paolo", password: "1234", ruolo: "dipendente", comparto: "autisti", nome: "Paolo Costa" },

  // RIMESSA (max 1 approvata al giorno)
  { username: "gio", password: "1234", ruolo: "dipendente", comparto: "rimessa", nome: "Gio Romano" },
  { username: "fede", password: "1234", ruolo: "dipendente", comparto: "rimessa", nome: "Fede Greco" },

  // AMMINISTRATIVI (max 2 approvate al giorno)
  { username: "laura", password: "1234", ruolo: "dipendente", comparto: "amministrativi", nome: "Laura Conti" },
  { username: "nico", password: "1234", ruolo: "dipendente", comparto: "amministrativi", nome: "Nico Ferri" },
  { username: "vale", password: "1234", ruolo: "dipendente", comparto: "amministrativi", nome: "Valentina Serra" },

  // ADMIN
  { username: "admin", password: "admin", ruolo: "admin", nome: "Admin" },
];

// =====================
// LIMITI COMPARTO
// =====================
const LIMITI_COMPARTO = {
  autisti: 5,
  rimessa: 1,
  amministrativi: 2,
};

function getLimite(comparto) {
  return LIMITI_COMPARTO[comparto] ?? 0;
}

// =====================
// FILE JSON
// =====================
const ferieFile = path.join(__dirname, "ferie.json");

function ensureFerieFile() {
  if (!fs.existsSync(ferieFile)) fs.writeFileSync(ferieFile, "[]", "utf-8");
}

function readFerie() {
  ensureFerieFile();
  try {
    const raw = fs.readFileSync(ferieFile, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function writeFerie(data) {
  fs.writeFileSync(ferieFile, JSON.stringify(data, null, 2), "utf-8");
}

function ymd(x) {
  return String(x).slice(0, 10);
}

function daysInMonth(year, monthIndex0) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

function eachDay(dal, al) {
  const out = [];
  const start = new Date(dal + "T00:00:00");
  const end = new Date(al + "T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// =====================
// LOGIN
// =====================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const utente = utenti.find((u) => u.username === username && u.password === password);
  if (!utente) return res.status(401).json({ error: "Credenziali errate" });

  return res.json(utente);
});

// =====================
// SLOTS PER MESE (CALENDARIO)
// GET /api/slots-month?comparto=autisti&month=2026-02
// =====================
app.get("/api/slots-month", (req, res) => {
  const { comparto, month } = req.query; // "YYYY-MM"

  if (!comparto || !month) {
    return res.status(400).json({ error: "Parametri mancanti: comparto, month (YYYY-MM)" });
  }

  const limite = getLimite(comparto);
  if (!limite) return res.status(400).json({ error: "Comparto non valido" });

  const [yStr, mStr] = String(month).split("-");
  const year = Number(yStr);
  const monthIndex0 = Number(mStr) - 1;

  if (!year || monthIndex0 < 0 || monthIndex0 > 11) {
    return res.status(400).json({ error: "Formato month non valido (usa YYYY-MM)" });
  }

  const ferie = readFerie();
  const dim = daysInMonth(year, monthIndex0);

  const out = {};
  for (let dayNum = 1; dayNum <= dim; dayNum++) {
    const day = new Date(year, monthIndex0, dayNum).toISOString().slice(0, 10);

    const approvedCount = ferie.filter(
      (r) => r.comparto === comparto && ymd(r.data) === day && r.status === "APPROVATA"
    ).length;

    const available = Math.max(limite - approvedCount, 0);
    out[day] = { limite, approvedCount, available };
  }

  return res.json({ comparto, month, days: out });
});

// =====================
// RICHIESTE (LISTA)
// GET /api/richieste?username=mario
// =====================
app.get("/api/richieste", (req, res) => {
  const { username } = req.query;
  const ferie = readFerie();
  const out = username ? ferie.filter((r) => r.username === username) : ferie;
  return res.json(out);
});

// =====================
// RICHIESTA DAL/AL
// POST /api/richieste-range { username, nome, comparto, dal, al }
// crea UNA richiesta per OGNI giorno del range.
// =====================
app.post("/api/richieste-range", (req, res) => {
  const { username, nome, comparto, dal, al } = req.body;

  if (!username || !comparto || !dal || !al) {
    return res.status(400).json({ error: "Dati mancanti (username, comparto, dal, al)" });
  }

  const limite = getLimite(comparto);
  if (!limite) return res.status(400).json({ error: "Comparto non valido" });

  const start = ymd(dal);
  const end = ymd(al);
  if (end < start) return res.status(400).json({ error: "Intervallo non valido (al < dal)" });

  const ferie = readFerie();
  const days = eachDay(start, end);

  const created = [];

  for (const day of days) {
    const approvedCount = ferie.filter(
      (r) => r.comparto === comparto && ymd(r.data) === day && r.status === "APPROVATA"
    ).length;

    const status = approvedCount >= limite ? "IN_ATTESA" : "APPROVATA";

    const nuova = {
      id: (Date.now() + Math.random()).toString(),
      username,
      nome: nome || username,
      comparto,
      data: day,
      dal: start,
      al: end,
      status,
      createdAt: new Date().toISOString(),
    };

    ferie.push(nuova);
    created.push(nuova);
  }

  writeFerie(ferie);

  const approvate = created.filter((x) => x.status === "APPROVATA").length;
  const attesa = created.filter((x) => x.status === "IN_ATTESA").length;

  return res.json({ created, summary: { totale: created.length, approvate, attesa } });
});

// =====================
// RIMUOVI RICHIESTA
// DELETE /api/richieste/:id
// =====================
app.delete("/api/richieste/:id", (req, res) => {
  const { id } = req.params;
  const ferie = readFerie();

  const idx = ferie.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ error: "Richiesta non trovata" });

  const removed = ferie.splice(idx, 1)[0];
  writeFerie(ferie);

  return res.json({ ok: true, removed });
});

app.listen(port, () => {
  console.log(`✅ Backend attivo su http://localhost:${port}`);
});
