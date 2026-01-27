import { useEffect } from "react";
import { Link } from "react-router-dom";
import notFoundImg from "../../assets/img/not-found.svg";
import {
    AUTH_LOGIN_PAGE_TITLE,
    NOT_FOUND_404, NOT_FOUND_404_BACK_TO_HOME, NOT_FOUND_404_PAGE_DOESNT_EXIST
} from "../../lang-dump/lang";

export default function Page404View() {

    useEffect(() => {
        document.title = AUTH_LOGIN_PAGE_TITLE;
    }, []);

    return (
        <div className="error-page">
            <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1>{NOT_FOUND_404}</h1>
                <h2>{NOT_FOUND_404_PAGE_DOESNT_EXIST}</h2>
                <Link className="btn" to={document.referrer}>{NOT_FOUND_404_BACK_TO_HOME}</Link>
                <img src={notFoundImg} className="img-fluid py-5" alt="Page Not Found" />
            </section>
        </div>
    );
}