import React, { useEffect, useState } from 'react';
import API from '../services/api';
import NotificationCard from '../components/NotificationCard';
import { useAuth } from '../context/AuthContext';

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAllNotifications();
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchAllNotifications = async () => {
    setError(null);
    try {
      const res = await API.get('/notifications'); // All notifications
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching all notifications:", err);
      setError(err.response?.data || "Failed to load notifications. Please try again later.");
    }
  };

  const fetchUserRegistrations = async () => {
    if (!user?.id) return;
    try {
      const res = await API.get(`/registrations/user/${user.id}`);
      setRegistrations(res.data.map(reg => reg.notificationId));
    } catch (err) {
      console.error("Error fetching user registrations:", err);
      // Don't set global error for this, as it's secondary to loading notifications
    }
  };

  const handleRegister = async (notificationId) => {
    if (!user?.id) {
      alert("Please log in to register for notifications.");
      return;
    }
    setError(null);
    try {
      await API.post('/registrations', {
        userId: user.id,
        notificationId: notificationId
      });
      alert("Registered Successfully ✅");
      setRegistrations(prev => [...prev, notificationId]); // Update state
    } catch (err) {
      console.error("Error registering:", err);
      setError(err.response?.data || "Failed to register. You might be already registered or an error occurred.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Available Notifications</h2>
      <p className="lead">Browse all notifications and register for those that interest you.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {notifications.length === 0 &&!error? (
          <div className="col-12">
            <p>No notifications available at this time.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div className="col-md-6 col-lg-4 mb-4" key={n.id}>
              <NotificationCard
                notification={n}
                onRegister={handleRegister}
                isRegistered={registrations.includes(n.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;