import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDark(!dark);
    document.body.style.background = !dark ? "#0f1923" : "#f0f4f8";
    document.body.style.color = !dark ? "#e8f4f8" : "#2d3748";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div style={{
      padding: "16px 32px",
      background: "linear-gradient(135deg, #2d5a7b 0%, #1a3a4f 100%)",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "24px" }}>🧠</span>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", letterSpacing: "0.5px" }}>
          MindWell
        </h2>
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {isLoggedIn && (
          <>
            <Link to="/dashboard" style={{
              color: "rgba(255,255,255,0.85)", textDecoration: "none",
              padding: "6px 14px", borderRadius: "20px", fontSize: "14px",
              transition: "background 0.2s"
            }}>📊 Dashboard</Link>
            <Link to="/journal" style={{
              color: "rgba(255,255,255,0.85)", textDecoration: "none",
              padding: "6px 14px", borderRadius: "20px", fontSize: "14px"
            }}>📝 Journal</Link>
            <Link to="/breathing" style={{
              color: "rgba(255,255,255,0.85)", textDecoration: "none",
              padding: "6px 14px", borderRadius: "20px", fontSize: "14px"
            }}>🌬️ Breathe</Link>
          </>
        )}
        <button onClick={toggleTheme} style={{
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
          color: "white", borderRadius: "20px", padding: "6px 14px",
          cursor: "pointer", fontSize: "13px"
        }}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
        {isLoggedIn && (
          <button onClick={handleLogout} style={{
            background: "rgba(255,100,100,0.2)", border: "1px solid rgba(255,100,100,0.4)",
            color: "white", borderRadius: "20px", padding: "6px 14px",
            cursor: "pointer", fontSize: "13px"
          }}>
            🚪 Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;