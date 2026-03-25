import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", data);
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid credentials or not approved");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">

      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className="form-control mb-2"
          placeholder="Email"
          onChange={e => setData({...data, email:e.target.value})}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={e => setData({...data, password:e.target.value})}
        />

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>

        <p className="mt-2 text-center">
          <Link to="/register">Register</Link>
        </p>
      </div>

    </div>
  );
}

export default Login;