import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={() => navigate("/ferie")}>
        Le mie ferie
      </button>

      <br /><br />

      <button onClick={() => navigate("/ferie-admin")}>
        Gestione ferie (Admin)
      </button>
    </div>
  );
}
