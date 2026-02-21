import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    AUTH_USER, AUTH_USER_INVALID_PASSWORD, INVALID_EMAIL_ADDRESS, INVALID_NAMING_CONVENSION, INVALID_PHONE_NUMBER, MANAGE_YOUR_PROFILE_PAGE_TITLE, PROJECT_ABOUT, SITE_TITLE
} from "../../lang-dump/lang";
import validationChecker from "../../utils/validations-checker";
import { toast } from "react-toastify";
import toasterMsgDisplay, { getActiveStatus, getAuthUserType } from "./FunctionHelper";
import { updateAuthUserApi } from "../../api/auth-users-api";
import profileImg from '/assets/img/profile-img.jpg';
import DashboardLayout from "../../DashboardLayout";

export default function AuthUserProfileView() {

    const storedAuthUser = sessionStorage.getItem("authUser");
    const [authUserDetail, setAuthUserDetail] = useState(storedAuthUser ? JSON.parse(storedAuthUser) : null);
    const [authUserId, setAuthUserId] = useState(storedAuthUser?.authUserId || "");
    const [authUserImage, setAuthUserImage] = useState(authUserDetail?.authUserImage || "");
    const [authUserName, setAuthUserName] = useState(authUserDetail?.authUserName || "");
    const [authUserPhoneNumber, setAuthUserPhoneNumber] = useState(authUserDetail?.authUserPhoneNumber || "");
    const [authUserEmailAddress, setAuthUserEmailAddress] = useState(authUserDetail?.authUserEmailAddress || "");
    const [authUserPassword, setAuthUserPassword] = useState("");
    const [authUserType, setAuthUserType] = useState(authUserDetail?.authUserType || "");
    const [authUserActive, setAuthUserActive] = useState(authUserDetail?.authUserActive || "");

    useEffect(() => {
        document.title = MANAGE_YOUR_PROFILE_PAGE_TITLE;
    });

    // HANDLE FOR SIDE EFFECT AFTER CHANGE
    useEffect(() => {
        if (storedAuthUser) {
            const parsed = JSON.parse(storedAuthUser);
            setAuthUserDetail(parsed);
            setAuthUserId(parsed.authUserId);
            setAuthUserImage(parsed.authUserImage || "");
            setAuthUserName(parsed.authUserName || "");
            setAuthUserPhoneNumber(parsed.authUserPhoneNumber);
            setAuthUserEmailAddress(parsed.authUserEmailAddress || "");
            setAuthUserType(parsed.authUserType || "");
            setAuthUserActive(parsed.authUserActive || "");
        }
    }, [storedAuthUser]);

    // HANDLE UPDATE SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validationChecker('text', authUserName.trim())) {
            toast.error(INVALID_NAMING_CONVENSION);
            return;
        }
        if (!validationChecker('email', authUserEmailAddress.trim())) {
            toast.error(INVALID_EMAIL_ADDRESS);
            return;
        }
        if (!validationChecker('phone', authUserPhoneNumber.trim())) {
            toast.error(INVALID_PHONE_NUMBER);
            return;
        }
        if (!validationChecker('password', authUserPassword.trim())) {
            toast.error(AUTH_USER_INVALID_PASSWORD);
            return;
        }

        const formData = new FormData();
        formData.append("authUserName", authUserName);
        formData.append("authUserEmailAddress", authUserEmailAddress);
        formData.append("authUserPhoneNumber", authUserPhoneNumber);
        if (authUserPassword) formData.append("authUserPassword", authUserPassword);

        try {
            await updateAuthUserApi(authUserId, formData);
            toast.success(toasterMsgDisplay('update', AUTH_USER));
            setTimeout(() => {
                location.reload();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error(toasterMsgDisplay('failed_cud', 'save', AUTH_USER));
        }
    };

    return (
        <DashboardLayout>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1 className="toggle-heading" style={{ textAlign: "left" }}>Manage Profile</h1>
                </div>

                <section className="section profile pt-2">
                    <div className="row">
                        <div className="col-xl-4">
                            <div className="card">
                                <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                                    <img src={authUserImage ? `${import.meta.env.VITE_8082_API_BASE}/uploads/${authUserImage}` : profileImg} alt="Profile" className="rounded-circle" loading="lazy" />
                                    <h2 className="card-title">{authUserName}</h2>
                                    <h3>{getAuthUserType(authUserType)}</h3>
                                    <div className="social-links mt-2">
                                        <Link to="https://github.com/SufalTalukder" className="github" target="_blank">
                                            <i className="bi bi-git"></i>
                                        </Link>
                                        <Link to="#" className="twitter">
                                            <i className="bi bi-twitter"></i>
                                        </Link>
                                        <Link to="#" className="facebook">
                                            <i className="bi bi-facebook"></i>
                                        </Link>
                                        <Link to="#" className="instagram">
                                            <i className="bi bi-instagram"></i>
                                        </Link>
                                        <Link to="#" className="linkedin">
                                            <i className="bi bi-linkedin"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-8">
                            <div className="card">
                                <div className="card-body pt-3">
                                    {/* Tabs View */}
                                    <ul className="nav nav-tabs nav-tabs-bordered">
                                        <li className="nav-item">
                                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">
                                                Edit Profile
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-settings">Settings</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Change Password</button>
                                        </li>
                                    </ul>

                                    <div className="tab-content pt-2">
                                        {/* Overview */}
                                        <div className="tab-pane fade show active profile-overview" id="profile-overview">
                                            <h5 className="card-title" style={{ textAlign: "left" }}>About</h5>
                                            <p className="small fst-italic">{PROJECT_ABOUT}</p>
                                            <h5 className="card-title" style={{ textAlign: "left" }}>Profile Details</h5>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Full Name</div>
                                                <div className="col-lg-9 col-md-8">{authUserName}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Company</div>
                                                <div className="col-lg-9 col-md-8">{SITE_TITLE}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Type</div>
                                                <div className="col-lg-9 col-md-8">{getAuthUserType(authUserType)}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Phone</div>
                                                <div className="col-lg-9 col-md-8">{authUserPhoneNumber}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Email</div>
                                                <div className="col-lg-9 col-md-8">{authUserEmailAddress}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Active</div>
                                                <div className="col-lg-9 col-md-8">{getActiveStatus(authUserActive)}</div>
                                            </div>
                                        </div>

                                        {/* Edit Profile */}
                                        <div className="tab-pane fade profile-edit pt-3" id="profile-edit">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row mb-3">
                                                    <label className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <img src={authUserImage ? `${import.meta.env.VITE_8082_API_BASE}/uploads/${authUserImage}` : profileImg} alt="Profile" loading="lazy" />
                                                        <div className="pt-2">
                                                            <Link to={"/"} className="btn btn-primary btn-sm" title="Upload new profile image">
                                                                <i className="bi bi-upload"></i>
                                                            </Link>
                                                            <Link to={"/"} className="btn btn-danger btn-sm" title="Remove my profile image">
                                                                <i className="bi bi-trash"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-md-4 col-lg-3 col-form-label">Full Name</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input type="text" className="form-control" value={authUserName} onChange={(e) => setAuthUserName(e.target.value)} autoComplete="new-name" maxLength="50" required />
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-md-4 col-lg-3 col-form-label">About</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <textarea className="form-control" value={PROJECT_ABOUT} rows={3} disabled></textarea>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-md-4 col-lg-3 col-form-label">Company</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input type="text" className="form-control" value={SITE_TITLE} disabled />
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-md-4 col-lg-3 col-form-label">Phone</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input type="text" className="form-control" value={authUserPhoneNumber} onChange={(e) => setAuthUserPhoneNumber(e.target.value)} autoComplete="new-phone" maxLength="10" minLength="10" required />
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-md-4 col-lg-3 col-form-label">Email</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input type="email" className="form-control" value={authUserEmailAddress} onChange={(e) => setAuthUserEmailAddress(e.target.value)} autoComplete="new-email" maxLength="50" required />
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-md-4 col-lg-3 col-form-label">GitHub Profile</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input type="text" className="form-control" value="https://github.com/SufalTalukder" disabled />
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                                </div>
                                            </form>
                                        </div>

                                        {/* Settings Form */}
                                        <div className="tab-pane fade pt-3" id="profile-settings">
                                            <div className="row mb-3">
                                                <label className="col-md-4 col-lg-3 col-form-label">Email Notifications</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="changesMade" />
                                                        <label className="form-check-label">
                                                            Changes made to your account
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="newProducts" />
                                                        <label className="form-check-label">
                                                            Information on new products and services
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="proOffers" />
                                                        <label className="form-check-label">
                                                            Marketing and promo offers
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="securityNotify" disabled />
                                                        <label className="form-check-label">
                                                            Security alerts
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                            </div>
                                        </div>

                                        {/* Change Password */}
                                        <div className="tab-pane fade pt-3" id="profile-change-password">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row mb-3">
                                                    <label className="col-md-4 col-lg-3 col-form-label">Current Password</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input type="password" className="form-control" value="" disabled />
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-md-4 col-lg-3 col-form-label">New Password</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input type="text" className="form-control" autoComplete="new-password" value={authUserPassword} onChange={(e) => setAuthUserPassword(e.target.value)} maxLength="20" minLength="8" required />
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </DashboardLayout>
    );
}