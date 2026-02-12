import React from "react";
import { Link } from "react-router-dom";

export default function DashboardDipendente({ user, logout }) {
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
          <h2 className="titleSm">Dashboard Dipendente</h2>
          <p className="muted">
            Benvenuto, <b>{user.nome}</b> • Comparto: <b>{user.comparto}</b>
          </p>
        </div>

        <button className="btn danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="grid">
        <div className="card">
          <h3 className="titleSm">Richiedi ferie</h3>
          <p className="muted">
            Inserisci una data e invia la richiesta. In base agli slot del comparto,
            può essere approvata subito o messa in attesa.
          </p>

          <Link to="/dipendente/ferie" className="btn primary" style={{ display: "inline-block", textDecoration: "none" }}>
            Vai a Richiesta Ferie
          </Link>

          <div className="hint">
            Limiti: autisti <b>5</b> • rimessa <b>1</b> • amministrativi <b>2</b>
          </div>
        </div>

        <div className="card">
          <h3 className="titleSm">Profilo</h3>
          <div className="line">
            <span className="muted">Nome</span>
            <b>{user.nome}</b>
          </div>
          <div className="line">
            <span className="muted">Username</span>
            <b>{user.username}</b>
          </div>
          <div className="line">
            <span className="muted">Ruolo</span>
            <b>{user.ruolo}</b>
          </div>
          <div className="line">
            <span className="muted">Comparto</span>
            <b>{user.comparto}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
