import { useEffect, useState } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const [newData, setNewData] = useState({
    title: "",
    message: "",
    deadline: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch {
      setError("Error loading notifications");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      setError("Error loading users");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const addNotification = async () => {
    try {
      await API.post("/notifications", {
        ...newData,
        recipients: "ALL"
      });
      setNewData({ title: "", message: "", deadline: "" });
      fetchNotifications();
    } catch {
      setError("Failed to add notification");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch {
      setError("Delete failed");
    }
  };

  const toggleComplete = async (id) => {
    try {
      await API.put(`/notifications/complete/${id}/${user.id}`);
      fetchNotifications();
    } catch {
      setError("Complete failed");
    }
  };

  const approveAdmin = async (id) => {
    try {
      await API.put(`/users/approve/${id}`);
      fetchUsers();
    } catch {
      setError("Approval failed");
    }
  };

  const pendingAdmins = users.filter(
    (u) => u.role === "ADMIN" && u.approved === false
  );

  const getCompletedUsers = (ids) => {
    if (!ids) return [];
    return users.filter((u) => ids.includes(u.id));
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between mb-4">
        <h2>Dashboard</h2>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ADMIN SECTION */}
      {user.role === "ADMIN" && (
        <>
          <div className="card p-3 mb-4 shadow">
            <h5>Pending Admin Approvals</h5>

            {pendingAdmins.length === 0 ? (
              <p>No pending admins</p>
            ) : (
              pendingAdmins.map((u) => (
                <div
                  key={u.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>{u.name} ({u.email})</span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => approveAdmin(u.id)}
                  >
                    Approve
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="card p-3 mb-4 shadow">
            <h5>Add Notification</h5>

            <input
              className="form-control mb-2"
              placeholder="Title"
              value={newData.title}
              onChange={(e) =>
                setNewData({ ...newData, title: e.target.value })
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Message"
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

            <button className="btn btn-primary" onClick={addNotification}>
              Send
            </button>
          </div>
        </>
      )}

      {/* NOTIFICATIONS */}
      {notifications.map((n) => {
        const completed = n.completedUsers?.includes(user.id);
        const completedUsers = getCompletedUsers(n.completedUsers);

        return (
          <div key={n.id} className="card p-3 mb-3 shadow">

            <h5>{n.title}</h5>
            <p>{n.message}</p>

            {user.role === "STUDENT" && (
              <button
                className={`btn ${
                  completed ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => toggleComplete(n.id)}
              >
                {completed ? "✔ Done" : "Mark Done"}
              </button>
            )}

            {user.role === "ADMIN" && (
              <>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteNotification(n.id)}
                >
                  Delete
                </button>

                <p className="mt-2">
                  Completed: {completedUsers.length}
                </p>

                {completedUsers.map((u) => (
                  <div key={u.id}>
                    {u.name} ({u.email})
                  </div>
                ))}
              </>
            )}
          </div>
        );
      })}

    </div>
  );
}

export default Dashboard;