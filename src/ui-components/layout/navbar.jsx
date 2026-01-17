import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import reactLogo from "../../assets/react.svg";

const Navbar = () => {
    const navigate = useNavigate();

    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [dots, setDots] = useState("");

    const logout = () => {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("authUser");
        navigate("/admin/login", { replace: true });
    };

    const toggleSidebar = () => {
        document.body.classList.toggle("toggle-sidebar");
    };

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
                <Link to="/admin/track-your-activity" className="logo d-flex align-items-center">
                    <img src={reactLogo} alt="Admin Logo" />
                    <span className="d-none d-lg-block ms-2">Admin Panel</span>
                </Link>
                <i className="bi bi-list toggle-sidebar-btn" role="button" aria-label="Toggle sidebar" onClick={toggleSidebar}></i>
            </div>
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item dropdown pe-3">
                        <button className="nav-link nav-profile d-flex align-items-center pe-0 btn" data-bs-toggle="dropdown">
                            <img src={reactLogo} alt="Profile" className="rounded-circle" />
                            <span className="d-none d-md-block dropdown-toggle ps-2">Admin User</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>Admin User</h6>
                                <span>(XXX) XXX-XXXX</span>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <Link to="/admin/my-profile" className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-person"></i>
                                    <span>My Profile</span>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button type="button" className="dropdown-item d-flex align-items-center" onClick={logout}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            {isOffline && (
                <div className="offline-banner">
                    ⚠ You're offline. Check your connection.<span className="dots">{dots}</span>
                </div>
            )}
        </header>
    );
};

export default Navbar;
