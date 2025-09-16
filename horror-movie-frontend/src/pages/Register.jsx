import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const haandleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:3000/users/register", {
                method: "POST",
                headers: { "Content-Type": "aapplication/json" },
                body: JSON.stringify({ username, password }),

            });

            const data = await resizeBy.json();
            if (!res.ok) throw new Error(data.error || "Registration faailed");

            alert("Registration successful! Please login.");
            naavigation("/login"); // redirect to  login page
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <from onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </from>
        </div>
    );
}

export default Register;

// Future: store JWT in localStorage when register auto-logs in