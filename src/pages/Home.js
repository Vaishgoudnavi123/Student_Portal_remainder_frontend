import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg border-0 text-center p-5" style={{ maxWidth: "500px", width: "100%" }}>
        
        <h1 className="fw-bold mb-3 text-primary">
          🎓 Student Reminder Portal
        </h1>

        <p className="text-muted mb-4">
          Never miss deadlines again. Stay organized and updated!
        </p>

        <div className="d-grid gap-3">
          <Link to="/login" className="btn btn-primary btn-lg">
            🔐 Login
          </Link>

          <Link to="/register" className="btn btn-outline-success btn-lg">
            📝 Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Home;