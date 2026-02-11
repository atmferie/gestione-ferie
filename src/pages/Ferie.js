import { useState } from "react";

export default function Ferie() {
  // richieste mock
  const [richieste, setRichieste] = useState([
    {
      id: 1,
      nome: "Mario Rossi",
      comparto: "Autisti",
      data: "2026-03-15",
      stato: "approvata",
    },
    {
      id: 2,
      nome: "Luigi Bianchi",
      comparto: "Autisti",
      data: "2026-03-15",
      stato: "approvata",
    },
    {
      id: 3,
      nome: "Giuseppe Verdi",
      comparto: "Autisti",
      data: "2026-03-15",
      stato: "approvata",
    },
    {
      id: 4,
      nome: "Paolo Neri",
      comparto: "Autisti",
      data: "2026-03-15",
      stato: "in_attesa",
    },
    {
      id: 5,
      nome: "Anna Blu",
      comparto: "Amministrativi",
      data: "2026-04-10",
      stato: "in_attesa",
    },
  ]);

  const getColore = (stato) => {
    switch (stato) {
      case "approvata":
        return "#c8f7c5"; // verde
      case "in_attesa":
        return "#fff3b0"; // giallo
      case "rifiutata":
        return "#f7c5c5"; // rosso
      default:
        return "#eee";
    }
  };

  return (
    <div>
      <h2>Gestione Ferie</h2>

      {richieste.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
            backgroundColor: getColore(r.stato),
          }}
        >
          <p>
            <strong>Dipendente:</strong> {r.nome}
          </p>
          <p>
            <strong>Comparto:</strong> {r.comparto}
          </p>
          <p>
            <strong>Data:</strong> {r.data}
          </p>
          <p>
            <strong>Stato:</strong>{" "}
            {r.stato === "approvata"
              ? "Approvata"
              : r.stato === "in_attesa"
              ? "In attesa"
              : "Rifiutata"}
          </p>
        </div>
      ))}
    </div>
  );
}
