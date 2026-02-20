import { useTranslation } from "react-i18next";
import { SITE_TITLE } from "../../../lang-dump/lang";

export default function Footer() {

    const { t } = useTranslation();

    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    return (
        <footer id="footer" className="footer fixed-bottom align-items-center">
            <p>
                © {previousYear !== currentYear
                    ? `${previousYear}-${currentYear}`
                    : currentYear}{" "}
                {SITE_TITLE}. {t('common.all_rights_reserved')}.
            </p>
        </footer>
    );
}
