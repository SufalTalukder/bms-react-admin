import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import adminLogo from "/assets/img/react.svg";
import ReusableLoginButton from "../reusable-components/ReusableLoginButton";
import validationChecker from "../../utils/validations-checker";
import Header from "../page-layout/before-login/Header";
import { useTranslation } from "react-i18next";

export default function LoginView() {

    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = t('login.page_title');
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            navigate("/bms-book-store/admin/track-your-activity", { replace: true });
        }
    }, [navigate, t]);

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
            toast.error(t('login.email_and_password_required_error'));
            setLoading(false);
            return;
        }
        if (!validationChecker('email', email.trim())) {
            toast.error(t('login.invalid_email_error'));
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
            toast.success(t('login.success_message'));
            navigate("/bms-book-store/admin/track-your-activity");
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.response?.data?.message || t('login.error_message'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-5 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-5" style={{ width: "81%" }}>
                                <div className="pt-2 pb-2">
                                    <img src={adminLogo} alt="logo" className="rotate-logo" style={{ maxWidth: "50px" }} />
                                    <h5 className="card-title text-center pb-0 fs-4">
                                        {t('login.login_to_account')}
                                    </h5>
                                    <p className="text-center small">
                                        {t('login.email_and_password_required')}
                                    </p>
                                </div>
                                <form className="row g-3" onSubmit={handleSubmit} noValidate>
                                    <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                        <div className="form-floating">
                                            <input type="email" className="form-control" id="floatingEmail" placeholder="e.g; john.doe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" required />
                                            <label htmlFor="floatingEmail">{t('login.username')}</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                        <div className="form-floating">
                                            <input type="password" className="form-control" id="floatingPassword" placeholder="e.g; ••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
                                            <label htmlFor="floatingPassword" className="form-label">{t('login.password')}</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" value={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                            <label className="small mb-0">{t('login.remember_me')}</label>
                                        </div>
                                    </div>
                                    <ReusableLoginButton
                                        loading={loading}
                                        buttonType="submit"
                                        buttonText={t('login.sign_in')}
                                    />
                                    <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                        <p className="small mb-0">{t('login.dont_have_an_account')}
                                            <Link to="/bms-book-store/admin/create-account">
                                                &nbsp;{t('login.create_an_account')}
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
