import { useEffect, useState } from "react";
import adminLogo from "/assets/img/react.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    ALL_FIELDS_ARE_REQUIRED, AUTH_LOGIN_VALIDATION_ENTER_VALID_EMAIL, CREATE_ACCOUNT_TITLE, INVALID_NAMING_CONVENSION, INVALID_PASSWORD
} from "../../lang-dump/lang";
import validationChecker from "../../utils/validations-checker";
import { createAuthAccountApi } from "../../api/auth-users-api";

export default function CreateAuthAccountView() {

    const navigate = useNavigate();

    const [authFullName, setAuthFullName] = useState("");
    const [authUserEmail, setAuthUserEmail] = useState("");
    const [authUserPassword, setAuthUserPassword] = useState("");
    const [acceptMe, setAcceptMe] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = CREATE_ACCOUNT_TITLE;
    });

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
            toast.error(ALL_FIELDS_ARE_REQUIRED)
            setLoading(false);
            return;
        }
        if (!validationChecker('text', authFullName.trim())) {
            toast.error(INVALID_NAMING_CONVENSION);
            setLoading(false);
            return;
        }
        if (!validationChecker('email', authUserEmail.trim())) {
            toast.error(AUTH_LOGIN_VALIDATION_ENTER_VALID_EMAIL);
            setLoading(false);
            return;
        }
        if (!validationChecker('password', authUserPassword.trim())) {
            toast.error(INVALID_PASSWORD);
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
            toast.error("Error while creating account!");
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
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-5 d-flex flex-column align-items-center justify-content-center">
                        <div className="card mb-5" style={{ width: "81%" }}>
                            <div className="pt-2 pb-2">
                                <img src={adminLogo} alt="logo" className="rotate-logo" style={{ maxWidth: "50px" }} />
                                <h5 className="card-title text-center pb-0 fs-4">
                                    Create an Account
                                </h5>
                                <p className="text-center small">
                                    Enter your personal details to create account
                                </p>
                            </div>
                            <form className="row g-3" onSubmit={handleSubmit} noValidate>
                                <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="floatingName" placeholder="e.g; John Doe" value={authFullName} onChange={(e) => setAuthFullName(e.target.value)} autoComplete="off" required />
                                        <label htmlFor="floatingName">Your Name</label>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                    <div className="form-floating">
                                        <input type="email" className="form-control" id="floatingEmail" placeholder="e.g; john.doe@gmail.com" value={authUserEmail} onChange={(e) => setAuthUserEmail(e.target.value)} autoComplete="off" required />
                                        <label htmlFor="floatingEmail">Your Email</label>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                    <div className="form-floating">
                                        <input type="password" className="form-control" id="floatingPassword" placeholder="e.g; ••••••••" value={authUserPassword} onChange={(e) => setAuthUserPassword(e.target.value)} autoComplete="new-password" required />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" value={acceptMe} onChange={(e) => setAcceptMe(e.target.checked)} />
                                        <label className="small mb-0">
                                            I agree to the <Link>Terms of Service</Link> and <Link>Privacy Policy</Link>.
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
                                        "Create Account"
                                    )}
                                </button>
                                <div className="col-lg-12 col-md-12" style={{ textAlign: "left" }}>
                                    <p className="small mb-0">Already have an account?
                                        <Link to="/bms-book-store/admin/login">
                                            &nbsp;Sign in
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