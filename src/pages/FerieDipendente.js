import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function FerieDipendente({ user }) {
  const [richieste, setRichieste] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);

  const MAX_GIORNO = {
    autisti: 5,
    amministrativi: 2,
    rimessa: 1,
  };

  // Carica richieste da localStorage
  useEffect(() => {
    const salvate = JSON.parse(localStorage.getItem("richiesteFerie")) || [];
    setRichieste(salvate);
  }, []);

  // Salva richieste su localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem("richiesteFerie", JSON.stringify(richieste));
  }, [richieste]);

  if (!user) return <p>Caricamento...</p>;

  // Controllo finestra mese consentita
  const finestraValida = (data) => {
    const mese = new Date(data).getMonth() + 1;
    return (mese >= 1 && mese <= 5) || (mese >= 10 && mese <= 11);
  };

  // Conta slot occupati in un giorno per il comparto
  const slotOccupati = (giorno) => {
    return richieste.filter(
      (r) =>
        r.comparto === user.comparto &&
        r.stato === "approvata" &&
        r.giorni.includes(giorno)
    ).length;
  };

  // Gestione selezione giorno nel calendario
  const handleSelectDay = (date) => {
    const g = date.toISOString().split("T")[0];

    if (!finestraValida(g)) {
      alert("Giorno non valido (solo Gen-Mag e Ott-Nov)");
      return;
    }

    setSelectedDates((prev) =>
      prev.includes(g) ? prev.filter((d) => d !== g) : [...prev, g]
    );
  };

  // Invio richiesta
  const inviaRichiesta = () => {
    if (selectedDates.length === 0) {
      alert("Seleziona almeno un giorno");
      return;
    }

    let stato = "approvata";
    for (let g of selectedDates) {
      if (slotOccupati(g) >= MAX_GIORNO[user.comparto]) {
        stato = "in attesa";
        break;
      }
    }

    const nuovaRichiesta = {
      id: Date.now(),
      nome: user.nome,
      comparto: user.comparto,
      giorni: selectedDates,
      inizio: selectedDates[0],
      fine: selectedDates[selectedDates.length - 1],
      stato,
    };

    setRichieste((prev) => [...prev, nuovaRichiesta]);
    setSelectedDates([]);
  };

  const mieRichieste = richieste.filter((r) => r.nome === user.nome);

  // Evidenziazione giorni nel calendario
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const g = date.toISOString().split("T")[0];
    const slot = slotOccupati(g);

    if (selectedDates.includes(g)) return "giorno-selezionato";
    if (slot >= MAX_GIORNO[user.comparto]) return "giorno-pieno";
    return "giorno-libero";
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: 24 }}>Richiesta ferie</h2>
      <p>
        <strong>{user.nome}</strong> — {user.comparto}
      </p>

      <div style={{ marginBottom: 20 }}>
        <Calendar onClickDay={handleSelectDay} tileClassName={tileClassName} />
      </div>

      <button
        onClick={inviaRichiesta}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Invia richiesta
      </button>

      <hr />

      <h3 style={{ fontSize: 20 }}>Le mie richieste</h3>
      {mieRichieste.length === 0 && <p>Nessuna richiesta</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {mieRichieste.map((r) => {
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
              }}
            >
              <div>
                <strong>
                  {r.inizio} → {r.fine}
                </strong>
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
          );
        })}
      </div>

      <style>
        {`
          .giorno-pieno {
            background-color: #f8d7da !important;
            color: #721c24 !important;
          }
          .giorno-selezionato {
            background-color: #007bff !important;
            color: white !important;
          }
          .giorno-libero {
            background-color: #d4edda !important;
            color: #155724 !important;
          }
        `}
      </style>
    </div>
  );
}

export default FerieDipendente;
