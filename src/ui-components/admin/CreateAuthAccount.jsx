import { useEffect, useState } from "react";
import adminLogo from "/assets/img/react.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validationChecker from "../../utils/validations-checker";
import { createAuthAccountApi } from "../../api/auth-users-api";
import Header from "../page-layout/before-login/Header";
import { useTranslation } from "react-i18next";

export default function CreateAuthAccountView() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [authFullName, setAuthFullName] = useState("");
    const [authUserEmail, setAuthUserEmail] = useState("");
    const [authUserPassword, setAuthUserPassword] = useState("");
    const [acceptMe, setAcceptMe] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = t('create_account.page_title');
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

        if (!authFullName.trim() ||
            !authUserEmail.trim() ||
            !authUserPassword.trim() ||
            !acceptMe
        ) {
            toast.error(t('common.all_fields_are_required'))
            setLoading(false);
            return;
        }
        if (!validationChecker('text', authFullName.trim())) {
            toast.error(t('common.invalid_naming_convension'));
            setLoading(false);
            return;
        }
        if (!validationChecker('email', authUserEmail.trim())) {
            toast.error(t('common.invalid_email_address'));
            setLoading(false);
            return;
        }
        if (!validationChecker('password', authUserPassword.trim())) {
            toast.error(t('common.invalid_password_format'));
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("authUserName", authFullName);
        formData.append("authUserEmailAddress", authUserEmail);
        formData.append("authUserPassword", authUserPassword);

        try {
            setLoading(true);
            await createAuthAccountApi(formData);
            toast.error("Account created successfully!");
            navigate("/bms-book-store/admin/login");
            resetForm();
        } catch (error) {
            console.error("Error: ", error);
            toast.error(t('common.error_while_creating_record'));
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setAuthFullName("");
        setAuthUserEmail("");
        setAuthUserPassword("");
        setLoading(false);
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
                                        {t('create_account.create_an_account')}
                                    </h5>
                                    <p className="text-center small">
                                        {t('create_account.enter_your_details_to_create_an_account')}
                                    </p>
                                </div>
                                <form className="row g-3" onSubmit={handleSubmit} noValidate>
                                    <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="floatingName" placeholder="e.g; John Doe" value={authFullName} onChange={(e) => setAuthFullName(e.target.value)} autoComplete="off" required />
                                            <label htmlFor="floatingName">{t('create_account.name')}</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                        <div className="form-floating">
                                            <input type="email" className="form-control" id="floatingEmail" placeholder="e.g; john.doe@gmail.com" value={authUserEmail} onChange={(e) => setAuthUserEmail(e.target.value)} autoComplete="off" required />
                                            <label htmlFor="floatingEmail">{t('create_account.email')}</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                        <div className="form-floating">
                                            <input type="password" className="form-control" id="floatingPassword" placeholder="e.g; ••••••••" value={authUserPassword} onChange={(e) => setAuthUserPassword(e.target.value)} autoComplete="new-password" required />
                                            <label htmlFor="floatingPassword">{t('create_account.password')}</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" value={acceptMe} onChange={(e) => setAcceptMe(e.target.checked)} />
                                            <label className="small mb-0">
                                                {t('create_account.agree_to')} <Link>{t('create_account.terms_of_service')}</Link> {t('common.and')} <Link>{t('create_account.privacy_policy')}</Link>.
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-primary w-100"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            </>
                                        ) : (
                                            t('create_account.create_account')
                                        )}
                                    </button>
                                    <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                        <p className="small mb-0">{t('create_account.already_have_an_account')}
                                            <Link to="/bms-book-store/admin/login">
                                                &nbsp;{t('login.sign_in')}
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