import React, { useState } from "react";
import logo from "../assets/logo.png";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

function Login({ login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comparto, setComparto] = useState("autisti");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Credenziali errate");
        return;
      }

      const user = await res.json();

      // ✅ comparto controllato SOLO per dipendente
      if (user.ruolo === "dipendente" && user.comparto !== comparto) {
        alert(`Comparto errato! Il tuo comparto corretto è: ${user.comparto}`);
        return;
      }

      // ✅ admin passa sempre
      login(user);
    } catch (err) {
      console.error(err);
      alert("Errore di connessione al backend");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <img src={logo} alt="Logo Aziendale" style={{ height: 80 }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: 300, padding: 20, border: "1px solid #ccc", borderRadius: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ marginBottom: 10, padding: 6 }} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ marginBottom: 10, padding: 6 }} />

        <label>Comparto</label>
        <select value={comparto} onChange={(e) => setComparto(e.target.value)} style={{ marginBottom: 20, padding: 6 }}>
          <option value="amministrativi">Amministrativi</option>
          <option value="autisti">Autisti</option>
          <option value="rimessa">Rimessa</option>
        </select>

        <button type="submit" style={{ padding: 10, backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" }}>
          Accedi
        </button>

        <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
          Admin: <b>admin / admin</b>
        </div>
      </form>
    </div>
  );
}

export default Login;
