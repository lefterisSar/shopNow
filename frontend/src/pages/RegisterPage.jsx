import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: ""
    });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: []
    });
    const [apiError, setApiError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear field-specific error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }

        // Check password strength when password field changes
        if (name === "password") {
            validatePasswordStrength(value);
        }
    };

    const validatePasswordStrength = (password) => {
        const feedback = [];
        let score = 0;

        // Length check
        if (password.length >= 8) {
            score++;
        } else {
            feedback.push("Password must be at least 8 characters long");
        }

        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score++;
        } else {
            feedback.push("Password must contain at least 1 uppercase letter");
        }

        // Lowercase check
        if (/[a-z]/.test(password)) {
            score++;
        } else {
            feedback.push("Password must contain at least 1 lowercase letter");
        }

        // Digit check
        if (/[0-9]/.test(password)) {
            score++;
        } else {
            feedback.push("Password must contain at least 1 digit");
        }

        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        } else {
            feedback.push("Password must contain at least 1 special character");
        }

        setPasswordStrength({ score, feedback });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (passwordStrength.score < 5) {
            newErrors.password = "Password does not meet strength requirements";
        }

        if (!formData.fullName) {
            newErrors.fullName = "Full name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        if (validateForm()) {
            try {
                await axios.post("/api/users/register", formData);
                navigate("/login");
            } catch (err) {
                console.error(err);
                if (err.response && err.response.data) {
                    if (err.response.data.message) {
                        setApiError(err.response.data.message);
                    } else if (err.response.data.errors) {
                        // Handle validation errors from the server
                        const serverErrors = {};
                        err.response.data.errors.forEach(error => {
                            const field = error.field.toLowerCase();
                            serverErrors[field] = error.defaultMessage;
                        });
                        setErrors(serverErrors);
                    }
                } else {
                    setApiError("Registration failed. Please try again.");
                }
            }
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength.score) {
            case 0:
            case 1:
                return "red";
            case 2:
            case 3:
                return "orange";
            case 4:
                return "yellow";
            case 5:
                return "green";
            default:
                return "gray";
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
            <h2>Register</h2>
            {apiError && <p style={{ color: "red" }}>{apiError}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                    {errors.email && <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.email}</p>}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                    {errors.password && <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.password}</p>}

                    {/* Password strength meter */}
                    {formData.password && (
                        <div>
                            <div style={{ 
                                height: "5px", 
                                backgroundColor: "#eee", 
                                marginTop: "5px" 
                            }}>
                                <div style={{ 
                                    height: "100%", 
                                    width: `${(passwordStrength.score / 5) * 100}%`, 
                                    backgroundColor: getPasswordStrengthColor(),
                                    transition: "width 0.3s, background-color 0.3s"
                                }}></div>
                            </div>
                            <div style={{ marginTop: "5px" }}>
                                {passwordStrength.feedback.map((feedback, index) => (
                                    <p key={index} style={{ color: "red", fontSize: "0.8rem", margin: "2px 0" }}>
                                        {feedback}
                                    </p>
                                ))}
                                {passwordStrength.score === 5 && (
                                    <p style={{ color: "green", fontSize: "0.8rem", margin: "2px 0" }}>
                                        Password strength: Strong
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                    {errors.fullName && <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.fullName}</p>}
                </div>
                <button 
                    type="submit" 
                    style={{ 
                        padding: "8px 16px", 
                        backgroundColor: "#4CAF50", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px", 
                        cursor: "pointer" 
                    }}
                >
                    Register
                </button>
                <p style={{ marginTop: "1rem" }}>
                    Already have an account? <a href="/login" style={{ color: "#4CAF50" }}>Login</a>
                </p>
            </form>
        </div>
    );
}
