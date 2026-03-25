import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    await API.post("/register", data);
    setMsg("Registered! Wait for admin approval if admin.");
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">

      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Register</h3>

        {msg && <div className="alert alert-success">{msg}</div>}

        <input className="form-control mb-2" placeholder="Name"
          onChange={e => setData({...data, name:e.target.value})}/>

        <input className="form-control mb-2" placeholder="Email"
          onChange={e => setData({...data, email:e.target.value})}/>

        <input type="password" className="form-control mb-2" placeholder="Password"
          onChange={e => setData({...data, password:e.target.value})}/>

        <select className="form-control mb-3"
          onChange={e => setData({...data, role:e.target.value})}>
          <option value="">Select Role</option>
          <option value="STUDENT">Student</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button className="btn btn-success w-100" onClick={handleRegister}>
          Register
        </button>

        <p className="mt-2 text-center">
          <Link to="/login">Login</Link>
        </p>
      </div>

    </div>
  );
}

export default Register;