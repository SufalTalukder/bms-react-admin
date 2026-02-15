import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import adminLogo from "/assets/img/react.svg";
import ReusableLoginButton from "../reusable-components/ReusableLoginButton";
import {
    AUTH_LOGIN_ENTER_EMAIL_AND_PASSWORD, AUTH_LOGIN_PAGE_TITLE, AUTH_LOGIN_PASSWORD, AUTH_LOGIN_REMEMBER_ME, AUTH_LOGIN_TITLE, AUTH_LOGIN_TO_YOUR_ACCOUNT, AUTH_LOGIN_USERNAME, AUTH_LOGIN_VALIDATION_EMAIL_AND_PASSWORD_REQUIRED, AUTH_LOGIN_VALIDATION_ENTER_VALID_EMAIL
} from "../../lang-dump/lang";
import toasterMsgDisplay from "./FunctionHelper";
import validationChecker from "../../utils/validations-checker";

export default function LoginView() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = AUTH_LOGIN_PAGE_TITLE;
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            navigate("/bms-book-store/admin/track-your-activity", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error(AUTH_LOGIN_VALIDATION_EMAIL_AND_PASSWORD_REQUIRED);
            setLoading(false);
            return;
        }
        if (!validationChecker('email', email.trim())) {
            toast.error(AUTH_LOGIN_VALIDATION_ENTER_VALID_EMAIL);
            setLoading(false);
            return;
        }

        const data = {
            authUserEmailAddress: email,
            authUserPassword: password,
        };

        try {
            setLoading(true);
            await login(data, rememberMe);
            toast.success(toasterMsgDisplay('login_add', AUTH_LOGIN_TITLE));
            navigate("/bms-book-store/admin/track-your-activity");
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.response?.data?.message || toasterMsgDisplay('login_failed', AUTH_LOGIN_TITLE));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-5 d-flex flex-column align-items-center justify-content-center">
                        <div className="card mb-5" style={{ width: "81%" }}>
                            <div className="pt-2 pb-2">
                                <img src={adminLogo} alt="logo" className="rotate-logo" style={{ maxWidth: "50px" }} />
                                <h5 className="card-title text-center pb-0 fs-4">
                                    {AUTH_LOGIN_TO_YOUR_ACCOUNT}
                                </h5>
                                <p className="text-center small">
                                    {AUTH_LOGIN_ENTER_EMAIL_AND_PASSWORD}
                                </p>
                            </div>
                            <form className="row g-3" onSubmit={handleSubmit} noValidate>
                                <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                    <div className="form-floating">
                                        <input type="email" className="form-control" id="floatingEmail" placeholder="e.g; john.doe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" required />
                                        <label htmlFor="floatingEmail">{AUTH_LOGIN_USERNAME}</label>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                    <div className="form-floating">
                                        <input type="password" className="form-control" id="floatingPassword" placeholder="e.g; ••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
                                        <label htmlFor="floatingPassword" className="form-label">{AUTH_LOGIN_PASSWORD}</label>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" value={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                        <label className="small mb-0">{AUTH_LOGIN_REMEMBER_ME}</label>
                                    </div>
                                </div>
                                <ReusableLoginButton
                                    loading={loading}
                                    buttonType="submit"
                                    buttonText="Sign in"
                                />
                                <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                    <p className="small mb-0">Don`t have account?
                                        <Link to="/bms-book-store/admin/create-account">
                                            &nbsp;Create an account
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
