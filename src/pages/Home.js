import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return (
    <div
      className="container d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#e8f0f7" }} // Soft pastel blue background
    >
      <div
        className="card shadow-lg border-0 text-center p-5"
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#fdfdfd", // Very light gray card
          color: "#2c3e50" // Dark slate text
        }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#3b5998" }}>
          🎓 Student Reminder Portal
        </h1>

        <p className="mb-4">
          Never miss deadlines again. Stay organized and updated!
        </p>

        <div className="d-grid gap-3">
          <Link
            to="/login"
            className="btn btn-lg"
            style={{ backgroundColor: "#5dade2", color: "white" }} // Pleasant sky blue
          >
            🔐 Login
          </Link>

          <Link
            to="/register"
            className="btn btn-lg"
            style={{ backgroundColor: "#58d68d", color: "white" }} // Soft green
          >
            📝 Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
