import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = () => {
    const { user, loading } = useAuth();
    const token = sessionStorage.getItem("authToken");

    if (loading) return null; // show spinner if loading
    if (!user || !token) return <Navigate to="/admin/login" replace />;

    return <Outlet />;
};

export default PrivateRoute;
