import React, { useState, useEffect } from "react";

function FerieAdmin() {
  const [richieste, setRichieste] = useState([]);
  const [filtro, setFiltro] = useState("tutti");

  // Carica richieste da localStorage
  useEffect(() => {
    const salvate = JSON.parse(localStorage.getItem("richiesteFerie")) || [];
    setRichieste(salvate);
  }, []);

  // Aggiorna richieste e salva su localStorage
  const aggiorna = (nuove) => {
    setRichieste(nuove);
    localStorage.setItem("richiesteFerie", JSON.stringify(nuove));
  };

  // Approva richiesta
  const approva = (id) => {
    const nuove = richieste.map((r) =>
      r.id === id ? { ...r, stato: "approvata" } : r
    );
    aggiorna(nuove);
  };

  // Rifiuta richiesta
  const rifiuta = (id) => {
    const nuove = richieste.map((r) =>
      r.id === id ? { ...r, stato: "rifiutata" } : r
    );
    aggiorna(nuove);
  };

  // Filtra richieste per comparto
  const richiesteFiltrate =
    filtro === "tutti"
      ? richieste
      : richieste.filter((r) => r.comparto === filtro);

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: 24 }}>Gestione ferie (Admin)</h2>

      {/* Filtro comparto */}
      <div style={{ marginBottom: 20 }}>
        <label>Filtra per comparto: </label>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ padding: "4px 8px", borderRadius: "5px", marginLeft: "10px" }}
        >
          <option value="tutti">Tutti</option>
          <option value="autisti">Autisti</option>
          <option value="amministrativi">Amministrativi</option>
          <option value="rimessa">Rimessa</option>
        </select>
      </div>

      {richiesteFiltrate.length === 0 && <p>Nessuna richiesta presente</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {richiesteFiltrate.map((r) => {
          const colore =
            r.stato === "approvata"
              ? "green"
              : r.stato === "in attesa"
              ? "orange"
              : "red";

          return (
            <div
              key={r.id}
              style={{
                border: `1px solid ${colore}`,
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div>
                  <strong>{r.nome}</strong> ({r.comparto})<br />
                  {r.inizio} → {r.fine}
                </div>
                <span
                  style={{
                    backgroundColor: colore,
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    fontSize: "0.9em",
                  }}
                >
                  {r.stato.toUpperCase()}
                </span>
                <div>Giorni: {r.giorni.join(", ")}</div>
              </div>

              {r.stato === "in attesa" && (
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => approva(r.id)}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Approva
                  </button>
                  <button
                    onClick={() => rifiuta(r.id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Rifiuta
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FerieAdmin;
