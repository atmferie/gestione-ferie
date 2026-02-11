import React from "react";
import { Link } from "react-router-dom";

function DashboardDipendente({ user, logout }) {
  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: 24 }}>Dashboard Dipendente</h2>

      <p>
        Benvenuto <b>{user.nome}</b> <br />
        Comparto: <b>{user.comparto}</b>
      </p>

      {/* Link alla pagina ferie */}
      <div style={{ margin: "20px 0" }}>
        <Link to="/dipendente/ferie">
          <button
            style={{
              padding: "10px 16px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(0.9)")}
            onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          >
            Gestione ferie
          </button>
        </Link>
      </div>

      {/* Pulsante logout */}
      <button
        onClick={logout}
        style={{
          padding: "10px 16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "red",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(0.9)")}
        onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      >
        Logout
      </button>
    </div>
  );
}

export default DashboardDipendente;
