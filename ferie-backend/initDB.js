const db = require("./db");

// UTENTI
db.run(`
  CREATE TABLE IF NOT EXISTS utenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    ruolo TEXT,
    comparto TEXT
  )
`);

// UTENTI DI DEFAULT
const utenti = [
  ["mario", "1234", "dipendente", "autisti"],
  ["lucia", "1234", "dipendente", "amministrativi"],
  ["gianni", "1234", "dipendente", "rimessa"],
  ["Christian", "1234", "admin", null],
];

utenti.forEach(u => {
  db.run(
    "INSERT OR IGNORE INTO utenti (username, password, ruolo, comparto) VALUES (?, ?, ?, ?)",
    u
  );
});

console.log("DB inizializzato");
