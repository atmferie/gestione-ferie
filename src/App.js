import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import DashboardDipendente from "./pages/DashboardDipendente";
import FerieDipendente from "./pages/FerieDipendente";
import DashboardAdmin from "./pages/DashboardAdmin";
import FerieAdmin from "./pages/FerieAdmin";

const STORAGE_KEY = "atm_user";

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // ✅ questa è l’unica funzione login: riceve l'utente dal Login.jsx
  const login = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const logout = () => setUser(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Login login={login} />
            ) : (
              <Navigate to={user.ruolo === "admin" ? "/admin" : "/dipendente"} />
            )
          }
        />

        <Route
          path="/dipendente"
          element={
            user && user.ruolo === "dipendente" ? (
              <DashboardDipendente user={user} logout={logout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/dipendente/ferie"
          element={
            user && user.ruolo === "dipendente" ? (
              <FerieDipendente user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin"
          element={
            user && user.ruolo === "admin" ? (
              <DashboardAdmin user={user} logout={logout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/ferie"
          element={user && user.ruolo === "admin" ? <FerieAdmin /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
