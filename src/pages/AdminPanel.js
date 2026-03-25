import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ReminderModal from '../components/ReminderModal';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    description: '',
    deadline: '',
    targetAudience: 'ALL'
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      const [usersRes, notificationsRes] = await Promise.all([
        API.get('/users'),
        API.get('/notifications')
      ]);
      setUsers(usersRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      setError("Failed to load admin data.");
    }
  };

  const handleNotificationChange = (e) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({ ...prev, [name]: value }));
  };

  // Helper: Map targetAudience to recipients string
  const mapAudienceToRecipients = (audience) => {
    if (audience === 'ALL') return 'ALL';
    // Filter users by role (example: 'PLACEMENT', 'ACADEMIC')
    return users
      .filter(u => u.role === audience)
      .map(u => u.email)
      .join(',');
  };

  const handleAddNotification = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: newNotification.title,
        message: newNotification.description, // backend expects "message"
        deadline: newNotification.deadline
          ? new Date(newNotification.deadline).toISOString()
          : null,
        recipients: mapAudienceToRecipients(newNotification.targetAudience)
      };

      await API.post('/notifications', payload);

      setSuccessMessage('Notification added successfully!');
      setNewNotification({
        title: '',
        description: '',
        deadline: '',
        targetAudience: 'ALL'
      });
      fetchData();
    } catch (err) {
      setError("Failed to add notification.");
      console.error(err);
    }
  };

  const handleDelete = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteModal(true);
  };
const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'user') {
        await API.delete(`/users/${itemToDelete.id}`);
        setSuccessMessage('User deleted successfully!');
      } else {
        await API.delete(`/notifications/${itemToDelete.id}`);
        setSuccessMessage('Notification deleted successfully!');
      }
      fetchData();
    } catch (err) {
      setError("Failed to delete item.");
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="container mt-4">
      
      {/* HEADER */}
     <div className="mb-4 d-flex justify-content-between">
  <div>
    <h2 className="fw-bold">Admin Panel</h2>
    <p className="text-muted">
      Welcome, {user?.name || user?.email}
    </p>
  </div>
{u.role === 'ADMIN' && !u.approved && (
  <button
    className="btn btn-success btn-sm me-2"
    onClick={async () => {
      await API.put(`/users/approve/${u.id}`);
      fetchData();
    }}
  >
    Approve
  </button>
)}
  <button className="btn btn-danger" onClick={handleLogout}>
    Logout
  </button>
</div>

      {/* ALERTS */}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="row g-4">

        {/* ================= NOTIFICATIONS SECTION ================= */}
        <div className="col-lg-6">

          {/* ADD FORM */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white">
              Add Notification
            </div>
            <div className="card-body">
              <form onSubmit={handleAddNotification}>
                
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={newNotification.title}
                    onChange={handleNotificationChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={newNotification.description}
                    onChange={handleNotificationChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="deadline"
                    value={newNotification.deadline}
                    onChange={handleNotificationChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Target Audience</label>
                  <select
                    className="form-select"
                    name="targetAudience"
                    value={newNotification.targetAudience}
                    onChange={handleNotificationChange}
                  >
                    <option value="ALL">All Students</option>
                    <option value="PLACEMENT">Placement</option>
                    <option value="ACADEMIC">Academic</option>
                  </select>
                </div>

                <button className="btn btn-primary w-100">
                  Add Notification
                </button>
              </form>
            </div>
          </div>

          {/* LIST */}
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              Notification List
            </div>
            <div className="card-body p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <ul className="list-group list-group-flush">
                {notifications.map(n => (
                  <li key={n.id} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{n.title}</strong>
                      <br />
                      <small className="text-muted">
                        Deadline: {n.deadline || 'N/A'} | {n.recipients}
                      </small>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete('notification', n.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* ================= USERS SECTION ================= */}
        <div className="col-lg-6">

          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              Users List
            </div>

            <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <ul className="list-group list-group-flush">
                {users.map(u => (
                  <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                    
                    <div>
                      <strong>{u.name}</strong>
                      <br />
                      <small className="text-muted">{u.email} | {u.role}</small>
                    </div>

                    {u.role !== 'ADMIN' && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete('user', u.id)}
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL */}
      <ReminderModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${itemToDelete?.type}?`}
        onConfirm={confirmDelete}
        confirmText="Delete"
      />
    </div>
  );
}

export default AdminPanel;