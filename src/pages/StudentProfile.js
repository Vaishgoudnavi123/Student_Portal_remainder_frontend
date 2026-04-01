import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import NotificationCard from "../components/NotificationCard";
import { Link } from "react-router-dom";

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
      const res = await API.get(`/registrations/user/${user.id}/notifications`);
      setRegisteredNotifications(res.data);
    } catch (err) {
      console.error("Error fetching registered notifications:", err);
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
    <div className="container mt-4" style={{ backgroundColor: "#e8f0f7" }}>
      <h2 style={{ color: "#3b5998" }}>My Profile</h2>
      <div
        className="card mb-4"
        style={{ backgroundColor: "#fdfdfd", borderLeft: "5px solid #5dade2" }}
      >
        <div
          className="card-header"
          style={{ backgroundColor: "#5dade2", color: "white" }}
        >
          Personal Information
        </div>
        <div className="card-body" style={{ color: "#2c3e50" }}>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
        </div>
      </div>

      <h3 className="mt-5 mb-3" style={{ color: "#3b5998" }}>
        My Registered Deadlines
      </h3>
      <div className="row">
        {registeredNotifications.length === 0 ? (
          <div className="col-12">
            <p>You haven't registered for any notifications yet.</p>
            <Link
              to="/notifications"
              className="btn"
              style={{ backgroundColor: "#27ae60", color: "white" }}
            >
              Browse Notifications
            </Link>
          </div>
        ) : (
          registeredNotifications.map((notification) => (
            <div className="col-md-6 col-lg-4 mb-4" key={notification.id}>
              <div
                className="card h-100 p-3"
                style={{ backgroundColor: "#f0f9f4" }}
              >
                <NotificationCard notification={notification} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
