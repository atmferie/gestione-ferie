import React, { useState } from "react";
import logo from "../assets/logo.png";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://gestione-ferie-backend.onrender.com";

function Login({ login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
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

      if (user.ruolo === "dipendente") {
        if (user.comparto !== comparto) {
          alert(`Comparto errato! Il tuo comparto corretto è: ${user.comparto}`);
          return;
        }
      }

      await login(username, password);
    } catch (err) {
      console.error(err);
      alert("Errore di connessione al backend");
    }
  };

  return (
    <div className="container">
      <div className="loginHero">
        <img src={logo} alt="Logo Aziendale" className="loginLogoBig" />
        <h1 className="loginTitle">Gestione Ferie</h1>
        <p className="muted">Accesso dipendenti e amministrazione</p>
      </div>

      <div className="loginWrap">
        <form onSubmit={handleSubmit} className="card">
          <label className="checkRow">
            <input
              type="checkbox"
              checked={isAdminLogin}
              onChange={(e) => setIsAdminLogin(e.target.checked)}
            />
            <span>Accesso admin</span>
          </label>

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {!isAdminLogin && (
            <>
              <label>Comparto</label>
              <select value={comparto} onChange={(e) => setComparto(e.target.value)}>
                <option value="autisti">Autisti</option>
                <option value="rimessa">Rimessa</option>
                <option value="amministrativi">Amministrativi</option>
              </select>
            </>
          )}

          <button type="submit" className="btn primary">
            Accedi
          </button>

          <div className="hint">
            Dipendenti (demo) password: <b>1234</b> • Admin: <b>admin / admin</b>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
