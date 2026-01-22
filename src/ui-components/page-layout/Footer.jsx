import React from "react";

const Footer = () => {

    const year = new Date().getFullYear();

    return (
        <footer id="footer" className="footer text-center">
            <p>© {year} React Admin. All rights reserved.</p>
        </footer>
    );
};

export default Footer;