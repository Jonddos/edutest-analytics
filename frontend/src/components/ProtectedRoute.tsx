import { Navigate } from "react-router-dom";
import {type JSX} from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    // ⚙️ Lee directamente del localStorage, sin useState ni useEffect
    const token = localStorage.getItem("authToken");

    // 🔒 Si no hay token, redirige al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // ✅ Si hay token, renderiza el contenido protegido
    return children;
}