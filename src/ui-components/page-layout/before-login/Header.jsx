import { useEffect, useState } from "react";
import ThemeToggleButton from "../../reusable-components/ThemeToggleButton";
import LanguageToggleButton from "../../reusable-components/LanguageToggleButton";

export default function Header() {

    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [dots, setDots] = useState("");

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

    return (
        <header id="header" className="header fixed-top d-flex align-items-center">
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item dropdown pe-3">
                        <ThemeToggleButton />
                    </li>
                    <LanguageToggleButton />
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