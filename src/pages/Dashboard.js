import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const addNotification = async (title, message) => {
    await API.post("/notifications", {
      title,
      message,
      recipients: "ALL"
    });
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await API.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  const markDone = async (id) => {
    await API.put(`/notifications/complete/${id}/${user.id}`);
    fetchNotifications();
  };

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between">
        <h2>Dashboard</h2>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>

      {user.role === "ADMIN" && (
        <button
          className="btn btn-primary my-3"
          onClick={() => addNotification("Test", "New Task")}
        >
          Add Notification
        </button>
      )}

      {notifications.map(n => {
        const done = n.completedUsers?.includes(user.id);

        return (
          <div key={n.id} className="card p-3 mb-2">
            <h5>{n.title}</h5>
            <p>{n.message}</p>

            {user.role === "STUDENT" && (
              <button
                className="btn btn-success"
                onClick={() => markDone(n.id)}
              >
                {done ? "✔ Done" : "Mark Done"}
              </button>
            )}

            {user.role === "ADMIN" && (
              <button
                className="btn btn-danger"
                onClick={() => deleteNotification(n.id)}
              >
                Delete
              </button>
            )}
          </div>
        );
      })}

    </div>
  );
}

export default Dashboard;