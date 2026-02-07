import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import { LOGOUT, MY_PROFILE, SITE_TITLE } from "../../lang-dump/lang";
import reactLogo from "/assets/react.svg";
import profileImg from '/assets/img/profile-img.jpg';
import ThemeToggleButton from "../../ui-components/reusable-components/ThemeToggleButton";
import { logoutApi } from "../../api/auth-api";
import { toast } from "react-toastify";

export default function Navbar() {

    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const storedAuthUser = sessionStorage.getItem("authUser");
    const [authUserDetail, setAuthUserDetail] = useState(storedAuthUser ? JSON.parse(storedAuthUser) : null);
    const [authUserImage, setAuthUserImage] = useState(authUserDetail?.authUserImage || profileImg);
    const [authUserName, setAuthUserName] = useState(authUserDetail?.authUserName || "");
    const [authUserPhoneNumber, setAuthUserPhoneNumber] = useState(authUserDetail?.authUserPhoneNumber || "");

    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [dots, setDots] = useState("");

    useEffect(() => {
        if (storedAuthUser) {
            const parsed = JSON.parse(storedAuthUser);
            setAuthUserDetail(parsed);
            setAuthUserImage(parsed.authUserImage || "");
            setAuthUserName(parsed.authUserName || "");
            setAuthUserPhoneNumber(parsed.authUserPhoneNumber);
        }
    }, [storedAuthUser]);

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
        sessionStorage.removeItem("authUser");
        navigate("/admin/login", { replace: true });
    };

    const toggleSidebar = () => {
        const isToggled = document.body.classList.toggle("toggle-sidebar");

        const cols = document.querySelectorAll(".col-xl-4");

        cols.forEach(col => {
            col.style.paddingRight = isToggled ? "110px" : "";
        });
    };

    const toggleProfile = () => {
        setProfileOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ------------------------------
       Network status handling
    -------------------------------*/
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    /* ------------------------------
       Block fetch when offline
    -------------------------------*/
    useEffect(() => {
        const originalFetch = window.fetch;

        window.fetch = (...args) => {
            if (!navigator.onLine) {
                console.warn("Offline: fetch blocked");
                return Promise.reject(new Error("Offline"));
            }
            return originalFetch(...args);
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    /* ------------------------------
       Offline dots animation
    -------------------------------*/
    useEffect(() => {
        if (!isOffline) {
            setDots("");
            return;
        }

        let i = 0;
        const interval = setInterval(() => {
            setDots(".".repeat(i % 4));
            i++;
        }, 500);

        return () => clearInterval(interval);
    }, [isOffline]);

    return (
        <header id="header" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
                <Link to="#" className="logo d-flex align-items-center">
                    <img src={reactLogo} alt="Admin Logo" className="rotate-logo" loading="lazy" />
                    <span className="d-none d-lg-block ms-2 site-title">{SITE_TITLE}</span>
                </Link>
                <i className="bi bi-list toggle-sidebar-btn" role="button" aria-label="Toggle sidebar" onClick={toggleSidebar}></i>
            </div>
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item dropdown pe-3">
                        <ThemeToggleButton />
                    </li>
                    <li className="nav-item dropdown pe-3" ref={profileRef}>
                        <Link className="nav-link nav-profile d-flex align-items-center pe-0 btn" data-bs-toggle="dropdown" onClick={toggleProfile}>
                            <img src={authUserImage ? `${import.meta.env.VITE_8082_API_BASE}/uploads/${authUserImage}` : profileImg} alt="Profile" className="rounded-circle" loading="lazy" />
                            <span className="d-none d-md-block dropdown-toggle ps-2">{authUserName}</span>
                        </Link>
                        <ul
                            className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${profileOpen ? 'show' : ''}`}
                            style={
                                profileOpen
                                    ? {
                                        position: "absolute",
                                        inset: "0px 0px auto auto",
                                        margin: "0px",
                                        transform: "translate(-16px, 38px)",
                                    }
                                    : {}
                            }
                        >
                            <li className="dropdown-header">
                                <h6 className="site-title">{authUserName}</h6>
                                <span className="site-title"><i className="bi bi-phone"></i> {authUserPhoneNumber}</span>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <Link to="/admin/my-profile" className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-person"></i>
                                    <span>{MY_PROFILE}</span>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button type="button" className="dropdown-item d-flex align-items-center" onClick={logout}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>{LOGOUT}</span>
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            {isOffline && (
                <div className="offline-banner">
                    ⚠ You`re offline. Check your connection.<span className="dots">{dots}</span>
                </div>
            )}
        </header>
    );
}
