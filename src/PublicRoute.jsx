import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
    const token = sessionStorage.getItem("authToken");
    return token ? <Navigate to="/admin/track-your-activity" replace /> : <Outlet />;
}
