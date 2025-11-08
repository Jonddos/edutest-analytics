import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {type JSX} from "react";

interface PublicRouteProps {
    children: JSX.Element;
}

export default function PublicRoute({ children }: PublicRouteProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
}
