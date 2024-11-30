import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import "../styles/registerAndPassword.css";
import API_URL from "../apiConfig";

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePassword: React.FC = () => {
  const [form, setForm] = useState<ChangePasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage(null);

    if (form.newPassword !== form.confirmNewPassword) {
      setErrors(["New passwords do not match."]);
      return;
    }

    // Add basic password validation
    if (form.newPassword.length < 8) {
      setErrors(["Password must be at least 8 characters long."]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/account/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Password changed successfully.");
        setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
        setTimeout(() => navigate("/profile"), 2000); // Redirect after 2 seconds
      } else {
        const data = await response.json();
        setErrors([data.error || "Failed to change password."]);
      }
    } catch (error) {
      setErrors(["An unexpected error occurred. Please try again."]);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Change Password</h2>
      {errors.length > 0 && (
        <Alert variant="danger">
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </Alert>
      )}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            value={form.oldPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={form.confirmNewPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
