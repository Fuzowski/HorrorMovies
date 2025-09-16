import { Navigate } from "react-router-dom";

// Protect pages that require login
export default function RequireAuth({ children }) {
    const token = localStorage.getItem("token");

    if(!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// Future: can extend to decode JWT and check expiration