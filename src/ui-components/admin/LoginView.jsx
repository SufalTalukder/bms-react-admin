import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import adminLogo from "../../assets/img/react.svg";
import ReusableLoginButton from "../reusable-components/ReusableLoginButton";
import "../../App.css";
import {
    AUTH_LOGIN_EMAIL, AUTH_LOGIN_ENTER_EMAIL_AND_PASSWORD, AUTH_LOGIN_FAILED_MESSAGE, AUTH_LOGIN_PASSWORD, AUTH_LOGIN_REMEMBER_ME, AUTH_LOGIN_SUCCESS_MESSAGE, AUTH_LOGIN_TITLE, AUTH_LOGIN_TO_YOUR_ACCOUNT, AUTH_LOGIN_VALIDATION_EMAIL_AND_PASSWORD_REQUIRED, AUTH_LOGIN_VALIDATION_ENTER_VALID_EMAIL
} from "../../lang-dump/lang";

export default function LoginView() {

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = AUTH_LOGIN_TITLE;
        const token = sessionStorage.getItem("authToken");
        if (token) {
            navigate("/admin/track-your-activity", { replace: true });
        }
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email.trim() || !password.trim()) {
            toast.error(AUTH_LOGIN_VALIDATION_EMAIL_AND_PASSWORD_REQUIRED);
            setLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            toast.error(AUTH_LOGIN_VALIDATION_ENTER_VALID_EMAIL);
            setLoading(false);
            return;
        }

        try {
            await login(email, password);
            toast.success(AUTH_LOGIN_SUCCESS_MESSAGE);
            setTimeout(() => {
                navigate("/admin/track-your-activity");
            }, 500);
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.response?.data?.message || AUTH_LOGIN_FAILED_MESSAGE);
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-5 d-flex flex-column align-items-center justify-content-center">
                        <div className="card mb-3" style={{ width: "85%" }}>
                            <div className="card-body">
                                <div className="pt-4 pb-2">
                                    <img src={adminLogo} alt="logo" className="rotate-logo" style={{ maxWidth: "50px" }} />
                                    <h5 className="card-title text-center pb-0 fs-4">
                                        {AUTH_LOGIN_TO_YOUR_ACCOUNT}
                                    </h5>
                                    <p className="text-center small">
                                        {AUTH_LOGIN_ENTER_EMAIL_AND_PASSWORD}
                                    </p>
                                </div>
                                <form className="row g-3" onSubmit={handleSubmit} noValidate>
                                    <div className="col-12" style={{ textAlign: "left" }}>
                                        <label className="form-label">{AUTH_LOGIN_EMAIL}</label>
                                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="col-12" style={{ textAlign: "left" }}>
                                        <label className="form-label">{AUTH_LOGIN_PASSWORD}</label>
                                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="col-12" style={{ textAlign: "left" }}>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" name="remember" value="true" />
                                            <label className="form-check-label">{AUTH_LOGIN_REMEMBER_ME}</label>
                                        </div>
                                    </div>
                                    <ReusableLoginButton
                                        loading={loading}
                                        buttonType="submit"
                                        buttonText="Login"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
