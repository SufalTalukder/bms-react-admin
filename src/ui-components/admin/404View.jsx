import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import notFoundImg from "../../assets/img/not-found.svg";
import {
    AUTH_LOGIN_PAGE_TITLE,
    NOT_FOUND_404, NOT_FOUND_404_BACK_TO_HOME, NOT_FOUND_404_PAGE_DOESNT_EXIST
} from "../../lang-dump/lang";

export default function Page404View() {

    const navigate = useNavigate();

    useEffect(() => {
        document.title = AUTH_LOGIN_PAGE_TITLE;
    }, []);

    return (
        <div className="error-page">
            <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1>{NOT_FOUND_404}</h1>
                <h2>{NOT_FOUND_404_PAGE_DOESNT_EXIST}</h2>
                <button
                    className="btn"
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate("/");
                        }
                    }}
                >
                    {NOT_FOUND_404_BACK_TO_HOME}
                </button>
                <img src={notFoundImg} className="img-fluid py-5" alt="Page Not Found" />
            </section>
        </div>
    );
}