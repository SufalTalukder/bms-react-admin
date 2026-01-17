import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const token = sessionStorage.getItem("authToken");
    return token ? <Navigate to="/admin/track-your-activity" replace /> : <Outlet />;
};

export default PublicRoute;
