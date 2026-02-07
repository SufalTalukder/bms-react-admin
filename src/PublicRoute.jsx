import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    return token ? <Navigate to="/admin/track-your-activity" replace /> : <Outlet />;
}
