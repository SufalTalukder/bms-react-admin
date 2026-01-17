import React from "react";
import Navbar from "./ui-components/layout/navbar";
import Sidebar from "./ui-components/layout/sidebar";
import Footer from "./ui-components/layout/footer";

const DashboardLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <Sidebar />
            {children}
            <Footer />
        </>
    );
};

export default DashboardLayout;
