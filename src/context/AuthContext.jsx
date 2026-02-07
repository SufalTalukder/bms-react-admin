import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { loginApi, getAuthUserApi, logoutApi } from "../api/auth-api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // LOGIN
    const login = async (data, rememberMe) => {
        const res = await loginApi(data);

        const { accessToken, refreshToken } = res.data.content;

        setAccessToken(accessToken);
        sessionStorage.setItem("accessToken", accessToken);

        if (rememberMe) {
            localStorage.setItem("refreshToken", refreshToken);
        } else {
            sessionStorage.setItem("refreshToken", refreshToken);
        }

        await loadUser();
    };

    // LOAD USER
    const loadUser = async () => {
        try {
            const res = await getAuthUserApi();
            sessionStorage.setItem("authUser", JSON.stringify(res.data?.content));
            setUser(res.data.content);
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    };

    // LOGOUT
    const logout = async () => {
        try {
            await logoutApi({
                refreshToken:
                    localStorage.getItem("refreshToken") ||
                    sessionStorage.getItem("refreshToken")
            });
        } catch {
            toast.error("Failed to logout!");
        }

        sessionStorage.clear();
        localStorage.removeItem("refreshToken");

        setUser(null);
        setAccessToken(null);
        navigate("/admin/login", { replace: true });
    };

    // INIT
    useEffect(() => {
        const storedAccess = sessionStorage.getItem("accessToken");
        const storedRefresh =
            localStorage.getItem("refreshToken") ||
            sessionStorage.getItem("refreshToken");

        if (storedAccess || storedRefresh) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, login, logout, loading, accessToken, setAccessToken }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useAuth = () => useContext(AuthContext);
