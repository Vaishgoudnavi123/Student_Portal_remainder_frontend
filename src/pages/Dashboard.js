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
    const res = await API.get("/notifications");
    setNotifications(res.data);
  };

  const addNotification = async () => {
    await API.post("/notifications", newData);
    fetchNotifications();
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
    <div className="container py-4">

      <div className="d-flex justify-content-between">
        <h2>Dashboard</h2>

        <div>
          <span className="badge bg-primary me-2">{user?.role}</span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <p>Welcome, {user?.name}</p>

      {user?.role === "ADMIN" && (
        <div className="card p-3 mb-3">
          <input placeholder="Title" className="form-control mb-2"
            onChange={(e) => setNewData({ ...newData, title: e.target.value })} />

          <textarea placeholder="Message" className="form-control mb-2"
            onChange={(e) => setNewData({ ...newData, message: e.target.value })} />

          <input type="datetime-local" className="form-control mb-2"
            onChange={(e) => setNewData({ ...newData, deadline: e.target.value })} />

          <button className="btn btn-primary" onClick={addNotification}>
            Add Notification
          </button>
        </div>
      )}

      {notifications.map((n) => (
        <div key={n.id} className="card p-3 mb-2">
          <h5>{n.title}</h5>
          <p>{n.message}</p>

          <span className={`badge ${n.completed ? "bg-success" : "bg-warning"}`}>
            {n.completed ? "Done" : "Pending"}
          </span>

          {!n.completed && (
            <button className="btn btn-success btn-sm mt-2"
              onClick={() => markAsDone(n.id)}>
              Mark as Done
            </button>
          )}
        </div>
      ))}

    </div>
  );
}

export default Dashboard;