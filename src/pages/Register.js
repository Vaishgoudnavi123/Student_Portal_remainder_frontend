import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!data.name || !data.email || !data.password || !data.role) {
      setError("Please fill all fields");
      return;
    }

    try {
      await API.post("/register", data);
      setSuccess("Registered successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#e8f0f7" }} // Soft pastel background
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "420px",
          width: "100%",
          backgroundColor: "#fdfdfd", // Light gray card
          color: "#2c3e50"
        }}
      >
        <h3 className="text-center mb-3 fw-bold" style={{ color: "#27ae60" }}>
          📝 Register
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <input
          className="form-control mb-2"
          placeholder="Name"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <select
          className="form-select mb-3"
          onChange={(e) => setData({ ...data, role: e.target.value })}
        >
          <option value="">Select Role</option>
          <option value="STUDENT">Student</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          className="btn w-100"
          style={{ backgroundColor: "#5dade2", color: "white" }}
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#3b5998" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
