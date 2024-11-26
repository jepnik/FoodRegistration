import React, { useState } from "react";
import { RegisterUser } from "../types/user";
import API_URL from '../apiConfig';
import "../styles/registerAndPassword.css"; // CSS file equivalent to the link in the .NET view

const RegisterUser: React.FC = () => {
    const [formData, setFormData] = useState<RegisterUser>({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const registerUser = async (data: RegisterUser) => {
        try {
            const response = await fetch(`${API_URL}/account/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData.errors));
            }

            setSuccess(true); // Show success message
        } catch (error: any) {
            try {
                const parsedErrors = JSON.parse(error.message);
                setErrors(parsedErrors || {});
            } catch {
                setErrors({ general: "An error occurred. Please try again." });
            }
            console.error(error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);
        registerUser(formData);
    };

    return (
        <div className="register-form">
            <h2>Register</h2>
            {success && <p style={{ color: "green" }}>Registration successful!</p>}
            {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && (
                        <span style={{ color: "red" }}>{errors.confirmPassword}</span>
                    )}
                </div>
                <button type="submit" className="btn btn-primary mt-3 mb-5">
                    Register
                </button>
                <a href="/profile" className="btn btn-danger mt-3 mb-5">
                    Cancel
                </a>
            </form>
        </div>
    );
};

export default RegisterUser;