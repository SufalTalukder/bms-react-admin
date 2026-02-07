import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

export default function ThemeToggleButton() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Link style={{ fontSize: "26px" }} onClick={toggleTheme}>
            {theme === "light" ? <i className="ri-moon-fill"></i> : <i className="ri-sun-line"></i>}
        </Link>
    );
}
