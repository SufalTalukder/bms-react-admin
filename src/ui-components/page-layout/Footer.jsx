import React from "react";

export default function Footer() {

    const year = new Date().getFullYear();

    return (
        <footer id="footer" className="footer text-center">
            <p>© {year} React Admin. All rights reserved.</p>
        </footer>
    );
};