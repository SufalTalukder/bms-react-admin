import PropTypes from "prop-types";
import Navbar from "./ui-components/page-layout/after-login/Navbar";
import Sidebar from "./ui-components/page-layout/after-login/Sidebar";
import Footer from "./ui-components/page-layout/after-login/Footer";

export default function DashboardLayout({ children }) {
    return (
        <>
            <Navbar />
            <Sidebar />
            {children}
            <Footer />
        </>
    );
}

DashboardLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
