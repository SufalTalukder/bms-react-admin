import { SITE_TITLE } from "../../lang-dump/lang";

export default function Footer() {

    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    return (
        <footer id="footer" className="footer text-center">
            <p>© {previousYear}-{currentYear} {SITE_TITLE}. All rights reserved.</p>
        </footer>
    );
}
