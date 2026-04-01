import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!data.email || !data.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/login", data);
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#e8f0f7" }} // Soft pastel background
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fdfdfd", // Light gray card
          color: "#2c3e50"
        }}
      >
        <h3 className="text-center mb-3 fw-bold" style={{ color: "#3b5998" }}>
          🔐 Login
        </h3>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        <button
          className="btn w-100 mb-3"
          style={{ backgroundColor: "#5dade2", color: "white" }} // Pleasant blue
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center">
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#27ae60" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
