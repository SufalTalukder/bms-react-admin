import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import adminLogo from "../../assets/img/react.svg";

const LoginView = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Auth Login | Admin Panel";
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
            toast.error("Email & Password are required.");
            setLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        try {
            await login(email, password);
            toast.success("Login successful");
            setTimeout(() => {
                navigate("/admin/track-your-activity");
            }, 500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
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
                                    <img style={{ maxWidth: "40px" }} src={adminLogo} alt="logo" />
                                    <h5 className="card-title text-center pb-0 fs-4">
                                        Login to Your Account
                                    </h5>
                                    <p className="text-center small">
                                        Enter your email & password to login
                                    </p>
                                </div>
                                <form className="row g-3" onSubmit={handleSubmit} noValidate>
                                    <div className="col-12" style={{ textAlign: "left" }}>
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="col-12" style={{ textAlign: "left" }}>
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="col-12" style={{ textAlign: "left" }}>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" name="remember" value="true" />
                                            <label className="form-check-label">Remember me</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                                            {loading && (
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                            )}
                                            {loading ? "" : "Login"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginView;
