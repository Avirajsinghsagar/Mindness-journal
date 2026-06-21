import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <form onSubmit={submitHandler} style={{
        width: "340px", padding: "30px", border: "1px solid #ddd",
        borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center" }}>Create Account</h2>
        <p style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
          Your private mental wellness journal
        </p>

        <input type="text" placeholder="Full Name" value={name}
          onChange={(e) => setName(e.target.value)} required
          style={{ width: "100%", padding: "10px", marginTop: "15px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
        />
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          style={{ width: "100%", padding: "10px", marginTop: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
        />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          style={{ width: "100%", padding: "10px", marginTop: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
        />

        <button type="submit" style={{
          width: "100%", padding: "10px", marginTop: "20px",
          background: "#6366f1", color: "white", border: "none",
          borderRadius: "6px", cursor: "pointer", fontSize: "15px"
        }}>
          Register
        </button>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
          Already have an account? <Link to="/login" style={{ color: "#6366f1" }}>Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;