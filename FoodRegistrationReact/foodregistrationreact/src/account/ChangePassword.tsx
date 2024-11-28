import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmNewPassword) {
      setErrors(["New passwords do not match."]);
      return;
    }

    try {
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
        alert("Password changed successfully.");
        navigate("/profile");
      } else {
        const data = await response.json();
        setErrors([data.error || "Failed to change password."]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="register-form">
      <h2>Change password</h2>
      {errors.length > 0 && (
        <ul className="text-danger">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword">Old password</label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            value={form.oldPassword}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="confirmNewPassword">Confirm new password</label>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={form.confirmNewPassword}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3 mb-5">
          Submit
        </button>
        <button className="btn btn-danger mt-3 mb-5" onClick={() => navigate("/profile")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
