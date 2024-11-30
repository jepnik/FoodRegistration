import React, { useState } from "react";
import API_URL from "../apiConfig";
import { useAuth } from "../components/AuthContext";
import "../styles/login.css"; // Ensure your CSS includes styles for login-container, form-group, etc.
import { useNavigate } from "react-router-dom";
import Footer from "../shared/Footer";
import '../styles/Footer.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/account/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Store the token in AuthContext
        login(token);

        // Navigate users to the homepage on successful login
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <div className="login-container">
      <img src={`${API_URL}/images/FoodTrace.png`} alt="Logo" className="login-logo" /> 
      <h2>Login</h2>
      {error && <p className="alert">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn btn-success mt-4 mb-2 buttons-button">
          Login
        </button>
      </form>
      <a href="/register-user" className="btn btn-primary mt-2 buttons-button">
        Register User
      </a>

      <Footer/>
    </div>
    
  );
};

export default Login;
