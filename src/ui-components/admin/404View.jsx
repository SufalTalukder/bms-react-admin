import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import notFoundImg from "../../assets/img/not-found.svg";

export default function Page404View() {

    useEffect(() => {
        document.title = "404 Not Found | Admin Panel";
    }, []);

    return (
        <div className="error-page">
            <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1>404</h1>
                <h2>The page you are looking for doesn't exist.</h2>
                <Link className="btn" to="/admin/track-your-activity">Back to home</Link>
                <img src={notFoundImg} className="img-fluid py-5" alt="Page Not Found" />
            </section>
        </div>
    );
};