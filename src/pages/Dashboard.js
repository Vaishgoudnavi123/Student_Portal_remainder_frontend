import { useEffect, useState } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [newData, setNewData] = useState({
    title: "",
    message: "",
    deadline: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const addNotification = async () => {
    try {
      await API.post(`/notifications?role=${user?.role}`, newData);
      setNewData({ title: "", message: "", deadline: "" });
      fetchNotifications();
    } catch (err) {
      alert("Action failed: Access Denied or Server Error");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}?role=${user?.role}`);
      fetchNotifications();
    } catch (err) {
      alert("Only admins can delete notifications");
    }
  };

  const markAsDone = async (id) => {
    await API.put(`/notifications/${id}/complete`);
    fetchNotifications();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="container py-4" style={{ backgroundColor: "#e8f0f7" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#3b5998" }}>Dashboard</h2>
        <div>
          <span
            className="badge me-2"
            style={{ backgroundColor: "#5dade2", color: "white" }}
          >
            {user?.role}
          </span>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "#e74c3c", color: "white" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <p>
        Welcome, <strong style={{ color: "#27ae60" }}>{user?.name}</strong>
      </p>

      {/* ADMIN ONLY UI */}
      {user?.role === "ADMIN" && (
        <div
          className="card p-3 mb-4 shadow-sm"
          style={{ backgroundColor: "#fdfdfd", borderLeft: "5px solid #5dade2" }}
        >
          <h4 style={{ color: "#2c3e50" }}>Create New Notification</h4>
          <input
            placeholder="Title"
            className="form-control mb-2"
            value={newData.title}
            onChange={(e) =>
              setNewData({ ...newData, title: e.target.value })
            }
          />
          <textarea
            placeholder="Message"
            className="form-control mb-2"
            value={newData.message}
            onChange={(e) =>
              setNewData({ ...newData, message: e.target.value })
            }
          />
          <input
            type="datetime-local"
            className="form-control mb-2"
            value={newData.deadline}
            onChange={(e) =>
              setNewData({ ...newData, deadline: e.target.value })
            }
          />
          <button
            className="btn"
            style={{ backgroundColor: "#5dade2", color: "white" }}
            onClick={addNotification}
          >
            Add Notification
          </button>
        </div>
      )}

      {/* NOTIFICATION LIST */}
      <div className="row">
        {notifications.map((n) => (
          <div key={n.id} className="col-md-6 mb-3">
            <div
              className="card h-100 p-3"
              style={{ backgroundColor: "#f0f9f4" }}
            >
              <div className="d-flex justify-content-between">
                <h5 style={{ color: "#2c3e50" }}>{n.title}</h5>
                {user?.role === "ADMIN" && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteNotification(n.id)}
                  >
                    &times;
                  </button>
                )}
              </div>
              <p style={{ color: "#34495e" }}>{n.message}</p>
              <div className="mt-auto">
                <span
                  className={`badge ${
                    n.completed ? "bg-success" : "bg-warning text-dark"
                  }`}
                >
                  {n.completed ? "Done" : "Pending"}
                </span>
                {!n.completed && (
                  <button
                    className="btn btn-sm ms-2"
                    style={{ backgroundColor: "#27ae60", color: "white" }}
                    onClick={() => markAsDone(n.id)}
                  >
                    Mark as Done
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
