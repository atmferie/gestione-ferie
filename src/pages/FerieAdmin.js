import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://gestione-ferie-backend.onrender.com";

export default function FerieAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterComparto, setFilterComparto] = useState("tutti");
  const [filterStatus, setFilterStatus] = useState("tutti");

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/richieste`);
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Errore di connessione al backend");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/richieste/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const updated = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(updated.error || "Errore aggiornamento stato");
        return;
      }

      // aggiorna lista senza ricaricare tutta
      setList((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error(err);
      alert("Errore di connessione al backend");
    }
  };

  const filtered = useMemo(() => {
    return list
      .filter((r) => (filterComparto === "tutti" ? true : r.comparto === filterComparto))
      .filter((r) => (filterStatus === "tutti" ? true : r.status === filterStatus))
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }, [list, filterComparto, filterStatus]);

  const stats = useMemo(() => {
    const totale = list.length;
    const approvate = list.filter((x) => x.status === "APPROVATA").length;
    const attesa = list.filter((x) => x.status === "IN_ATTESA").length;
    const rifiutate = list.filter((x) => x.status === "RIFIUTATA").length;
    return { totale, approvate, attesa, rifiutate };
  }, [list]);

  return (
    <div className="container">
      <div className="headerRow">
        <div>
          <h2 className="titleSm">Ferie — Admin</h2>
          <p className="muted">
            Totale: <b>{stats.totale}</b> • Approvate: <b>{stats.approvate}</b> • In attesa:{" "}
            <b>{stats.attesa}</b> • Rifiutate: <b>{stats.rifiutate}</b>
          </p>
        </div>

        <button className="btn primary" onClick={loadAll} disabled={loading}>
          {loading ? "Aggiorno..." : "Aggiorna"}
        </button>
      </div>

      <div className="card">
        <div className="row">
          <div style={{ flex: 1 }}>
            <label>Comparto</label>
            <select value={filterComparto} onChange={(e) => setFilterComparto(e.target.value)}>
              <option value="tutti">Tutti</option>
              <option value="autisti">Autisti</option>
              <option value="rimessa">Rimessa</option>
              <option value="amministrativi">Amministrativi</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label>Stato</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="tutti">Tutti</option>
              <option value="APPROVATA">APPROVATA</option>
              <option value="IN_ATTESA">IN_ATTESA</option>
              <option value="RIFIUTATA">RIFIUTATA</option>
            </select>
          </div>
        </div>

        <div className="hint">
          Le richieste <b>IN_ATTESA</b> possono essere approvate o rifiutate.
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">Nessuna richiesta trovata.</p>
      ) : (
        <div className="grid">
          {filtered.map((r) => (
            <div key={r.id} className="card">
              <div className="row space">
                <div>
                  <div><b>Data:</b> {r.data}</div>
                  <div><b>Nome:</b> {r.nome || "-"}</div>
                  <div><b>Comparto:</b> {r.comparto}</div>
                  <div>
                    <b>Stato:</b>{" "}
                    <span
                      className={
                        r.status === "APPROVATA"
                          ? "badge ok"
                          : r.status === "RIFIUTATA"
                          ? "badge no"
                          : "badge wait"
                      }
                    >
                      {r.status}
                    </span>
                  </div>
                </div>

                {r.status === "IN_ATTESA" ? (
                  <div className="row" style={{ gap: 8 }}>
                    <button className="btn primary" onClick={() => updateStatus(r.id, "APPROVATA")}>
                      Approva
                    </button>
                    <button className="btn danger" onClick={() => updateStatus(r.id, "RIFIUTATA")}>
                      Rifiuta
                    </button>
                  </div>
                ) : (
                  <div className="muted small">—</div>
                )}
              </div>

              <div className="muted small">
                Creata: {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
