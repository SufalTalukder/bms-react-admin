import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const SwitchLangContext = createContext();

export function LangProvider({ children }) {
    
    const { i18n } = useTranslation();

    const [chooseLang, setChooseLang] = useState(() => {
        return localStorage.getItem("lang") || "en";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-lang", chooseLang);
        localStorage.setItem("lang", chooseLang);
        i18n.changeLanguage(chooseLang);
    }, [chooseLang, i18n]);

    const changeLanguage = (lng) => {
        setChooseLang(lng);
    };

    return (
        <SwitchLangContext.Provider value={{ chooseLang, changeLanguage }}>
            {children}
        </SwitchLangContext.Provider>
    );
}

LangProvider.propTypes = {
    children: PropTypes.node.isRequired
};
