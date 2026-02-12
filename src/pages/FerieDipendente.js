import React, { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

export default function FerieDipendente({ user }) {
  const [dal, setDal] = useState("");
  const [al, setAl] = useState("");
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRichieste = async () => {
    if (!user) return;
    const res = await fetch(
      `${API_BASE_URL}/api/richieste?username=${encodeURIComponent(user.username)}`
    );
    const list = await res.json();
    setRichieste(Array.isArray(list) ? list : []);
  };

  useEffect(() => {
    loadRichieste();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username]);

  const invia = async () => {
    if (!user) return;
    if (!dal || !al) return alert("Seleziona Dal e Al");
    if (al < dal) return alert("'Al' non può essere prima di 'Dal'");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/richieste-range`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          nome: user.nome,
          comparto: user.comparto,
          dal,
          al,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(result.error || "Errore");
        return;
      }

      alert(
        `Richiesta inviata.\nTotale: ${result.summary?.totale}\nApprovate: ${result.summary?.approvate}\nIn attesa: ${result.summary?.attesa}`
      );

      setDal("");
      setAl("");
      await loadRichieste();
    } catch (err) {
      console.error(err);
      alert("Errore di connessione al backend");
    } finally {
      setLoading(false);
    }
  };

  const rimuovi = async (id) => {
    if (!window.confirm("Vuoi rimuovere questa richiesta?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/richieste/${id}`, { method: "DELETE" });
      await loadRichieste();
    } catch (err) {
      console.error(err);
      alert("Errore di connessione al backend");
    }
  };

  if (!user) return null;

  return (
    <div className="container">
      <h2>Richiesta Ferie (Dal / Al)</h2>

      <div className="card">
        <label>Dal</label>
        <input type="date" value={dal} onChange={(e) => setDal(e.target.value)} />

        <label>Al</label>
        <input type="date" value={al} onChange={(e) => setAl(e.target.value)} />

        <button className="btn primary" onClick={invia} disabled={loading}>
          {loading ? "Invio..." : "Invia richiesta"}
        </button>

        <div className="hint">
          Limiti: autisti <b>5</b> • rimessa <b>1</b> • amministrativi <b>2</b>
        </div>
      </div>

      <h3>Le tue richieste</h3>
      {richieste.length === 0 ? (
        <p className="muted">Nessuna richiesta.</p>
      ) : (
        <div className="grid">
          {richieste
            .slice()
            .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
            .map((r) => (
              <div key={r.id} className="card">
                <div className="row space">
                  <div>
                    <div><b>Giorno:</b> {r.data}</div>
                    <div><b>Range:</b> {r.dal || r.data} → {r.al || r.data}</div>
                    <div>
                      <b>Stato:</b>{" "}
                      <span className={r.status === "APPROVATA" ? "badge ok" : "badge wait"}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                  <button className="btn danger" onClick={() => rimuovi(r.id)}>
                    Rimuovi
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
