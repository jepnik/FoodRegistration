import React, { useState } from "react";
import API_URL from "../apiConfig";
import "../styles/login.css";
import { User } from "../types/user"; // Importing the User type
import { useAuth } from "../components/AuthContext";

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Inside the Login.tsx submit handler
const { login } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const response = await fetch(`${API_URL}/account/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Login failed. Please check your credentials.");
        }

        const user = await response.json();
        login(); // Update authentication context
        window.location.href = "/home"; // Redirect to home or another protected page
    } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred. Please try again.");
    }
};


    return (
        <div className="login-container">
            <img src="/images/FoodTrace.png" alt="Logo" />
            <h2>Login</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success mt-4 mb-2 buttons-button">
                    Login
                </button>
            </form>
            <div>
                <a href="/register" className="btn btn-primary mt-2 buttons-button">
                    Register User
                </a>
            </div>
        </div>
    );
};

export default Login;
