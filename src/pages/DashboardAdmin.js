import React from "react";
import { Link } from "react-router-dom";

export default function DashboardAdmin({ user, logout }) {
  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <p className="muted">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="headerRow">
        <div>
          <h2 className="titleSm">Dashboard Admin</h2>
          <p className="muted">
            Accesso come <b>{user.nome}</b>
          </p>
        </div>

        <button className="btn danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="grid">
        <div className="card">
          <h3 className="titleSm">Gestione richieste ferie</h3>
          <p className="muted">
            Visualizza tutte le richieste (approvate / in attesa) e gestiscile.
          </p>

          <Link to="/admin/ferie" className="btn primary" style={{ display: "inline-block", textDecoration: "none" }}>
            Vai a Ferie (Admin)
          </Link>

          <div className="hint">
            Demo regole: autisti max 5 approvate • rimessa max 1 • amministrativi max 2
          </div>
        </div>

        <div className="card">
          <h3 className="titleSm">Info progetto</h3>
          <p className="muted">
            Demo full-stack: React (frontend) + Express (backend) + JSON storage.
            Deploy: Vercel + Render.
          </p>
          <div className="hint">
            Suggerimento portfolio: aggiungi screenshot + README “come testare la regola del 6° dipendente”.
          </div>
        </div>
      </div>
    </div>
  );
}
