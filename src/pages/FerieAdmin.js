import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

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
      setList([]);
      alert("Errore di connessione al backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    return { totale, approvate, attesa };
  }, [list]);

  return (
    <div className="container">
      <div className="headerRow">
        <div>
          <h2 className="titleSm">Ferie — Admin</h2>
          <p className="muted">
            Totale: <b>{stats.totale}</b> • Approvate: <b>{stats.approvate}</b> • In attesa:{" "}
            <b>{stats.attesa}</b>
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
            </select>
          </div>
        </div>

        <div className="hint">
          Nota: con DAL/AL, il backend salva una riga per ogni giorno. Qui le vedi tutte.
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">Nessuna richiesta trovata.</p>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: "10px 6px" }}>Data</th>
                <th style={{ padding: "10px 6px" }}>Nome</th>
                <th style={{ padding: "10px 6px" }}>Username</th>
                <th style={{ padding: "10px 6px" }}>Comparto</th>
                <th style={{ padding: "10px 6px" }}>Stato</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
                  <td style={{ padding: "10px 6px" }}>{r.data}</td>
                  <td style={{ padding: "10px 6px" }}>{r.nome || "-"}</td>
                  <td style={{ padding: "10px 6px" }}>{r.username}</td>
                  <td style={{ padding: "10px 6px" }}>{r.comparto}</td>
                  <td style={{ padding: "10px 6px" }}>
                    <span className={r.status === "APPROVATA" ? "badge ok" : "badge wait"}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
