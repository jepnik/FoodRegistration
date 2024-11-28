import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import API_URL from "../apiConfig";

interface UserProfile {
  email: string;
  userId: number;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/account/profile`, {
          credentials: "include", // Ensures session cookies are sent
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          navigate("/login"); // Redirect if unauthorized
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete this account? This action cannot be reversed.")) return;

    try {
      const response = await fetch(`${API_URL}/account/delete`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        alert("Account deleted successfully.");
        navigate("/login");
      } else {
        console.error("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!profile) return <p>Loading...</p>;

  const domain = profile.email.split("@")[1];
  const logo = domain === "anotherfoodcompany.com" ? "AlternativeUserLogo.png" : "UserLogo.png";

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h2>Profile: {profile.email}</h2>
        <div className="form-group">
          <p>
            This application allows you to register, track, and manage food items along with their nutritional content. From here, you can:
          </p>
          <ul>
            <li>
              <strong>Change Password:</strong> Update your password to ensure your account remains secure.
            </li>
            <li>
              <strong>Delete Account:</strong> Permanently remove your account and all associated data from the system.
            </li>
          </ul>
        </div>
        <div>
          <button className="btn btn-success" onClick={() => navigate("/change-password")}>
            Change Password
          </button>
          <button className="btn btn-danger mt-2 mb-5" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
      <div className="profile-logo">
        <img src={`${process.env.PUBLIC_URL}/images/${logo}`} alt="Logo" />
      </div>
    </div>
  );
};

export default Profile;
