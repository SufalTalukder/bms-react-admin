import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function PrivateRoute() {
    const { user, loading } = useAuth();
    const token = sessionStorage.getItem("authToken");

    if (loading) return null; // show spinner if loading
    if (!user || !token) return <Navigate to="/admin/login" replace />;

    return <Outlet />;
}
