import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SwitchLangContext } from "../../context/SwitchLangContext";

export default function LanguageToggleButton() {

    const { t } = useTranslation();
    const { chooseLang, changeLanguage } = useContext(SwitchLangContext);

    const languages = [
        { code: 'en', label: t('language.english') },
        { code: 'hi', label: t('language.hindi') },
        { code: 'bn', label: t('language.bengali') },
    ];

    const languageIcons = {
        en: "bi-translate",
        hi: "bi-chat-dots",
        bn: "bi-globe2",
    };

    const profileRef = useRef(null);
    const [languageOpen, setLanguageOpen] = useState(false);

    const toggleLang = () => {
        setLanguageOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setLanguageOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <li className="nav-item dropdown pe-3" ref={profileRef}>
            <button
                className="nav-link nav-profile d-flex align-items-center pe-0 btn btn-link"
                onClick={toggleLang}
            >
                <span className="d-none d-md-block dropdown-toggle ps-2">
                    {languages.find(l => l.code === chooseLang)?.label}
                </span>
            </button>

            <ul
                className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${languageOpen ? 'show' : ''}`}
                style={
                    languageOpen
                        ? {
                            position: "absolute",
                            inset: "0px 0px auto auto",
                            margin: "0px",
                            transform: "translate(-16px, 38px)",
                        }
                        : {}
                }
            >
                {languages.map((lang, index) => (
                    <React.Fragment key={lang.code}>
                        <li>
                            <button
                                type="button"
                                className={`dropdown-item d-flex align-items-center ${chooseLang === lang.code ? "active" : ""
                                    }`}
                                onClick={() => {
                                    changeLanguage(lang.code);
                                    setLanguageOpen(false);
                                }}
                            >
                                <i className={`bi ${languageIcons[lang.code]} me-2`}></i>
                                <span>{lang.label}</span>
                            </button>
                        </li>
                        {index !== languages.length - 1 && (
                            <li><hr className="dropdown-divider" /></li>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </li>
    );
}
