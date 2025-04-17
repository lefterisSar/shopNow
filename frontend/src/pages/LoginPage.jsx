import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("/api/users/login", {
                email,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/products");
        } catch (err) {
            console.error(err);
            setError("Invalid email or password");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
