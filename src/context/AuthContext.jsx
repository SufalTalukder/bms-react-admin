import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi, getAuthUserApi } from "../api/auth-api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const login = async (email, password) => {
        const res = await loginApi(email, password);
        const token = res.data.content.authToken;

        sessionStorage.setItem("authToken", token);
        await loadUser();
    };

    const loadUser = async () => {
        try {
            const res = await getAuthUserApi();
            sessionStorage.setItem("authUser", JSON.stringify(res.data.content));
            setUser(res.data.content);
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("authUser");
        setUser(null);
        navigate("/admin/login", { replace: true });
    };

    useEffect(() => {
        sessionStorage.getItem("authToken") ? loadUser() : setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
