import PropTypes from "prop-types";
import Navbar from "./ui-components/page-layout/Navbar";
import Sidebar from "./ui-components/page-layout/Sidebar";
import Footer from "./ui-components/page-layout/Footer";

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
    children: PropTypes.node.isRequired
};

