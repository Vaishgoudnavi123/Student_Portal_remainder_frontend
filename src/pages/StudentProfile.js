import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import NotificationCard from '../components/NotificationCard'; // To display registered notifications

function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [registeredNotifications, setRegisteredNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
      fetchRegisteredNotifications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      // Assuming a /users/{id} endpoint to get full user profile
      const res = await API.get(`/users/${user.id}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.response?.data || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredNotifications = async () => {
    try {
      // Assuming a /registrations/user/{userId}/notifications endpoint
      const res = await API.get(`/registrations/user/${user.id}/notifications`);
      setRegisteredNotifications(res.data);
    } catch (err) {
      console.error("Error fetching registered notifications:", err);
      // Not critical enough to show a full error banner, just log
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!profile) {
    return <div className="alert alert-info mt-4">No profile data available.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>My Profile</h2>
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          Personal Information
        </div>
        <div className="card-body">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          {/* Add more profile fields as needed */}
        </div>
      </div>

      <h3 className="mt-5 mb-3">My Registered Deadlines</h3>
      <div className="row">
        {registeredNotifications.length === 0? (
          <div className="col-12">
            <p>You haven't registered for any notifications yet.</p>
            <Link to="/notifications" className="btn btn-info">Browse Notifications</Link>
          </div>
        ) : (
          registeredNotifications.map(notification => (
            <div className="col-md-6 col-lg-4 mb-4" key={notification.id}>
              <NotificationCard notification={notification} /> {/* No register button here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentProfile;