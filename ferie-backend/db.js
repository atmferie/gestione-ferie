const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "db.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Errore DB", err.message);
  } else {
    console.log("Database SQLite connesso:", dbPath);
  }
});

module.exports = db;
