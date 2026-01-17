import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    const productRoutes = [
        "/admin/category-service",
        "/admin/sub-category-service",
        "/admin/product-service"
    ];
    const isProductActive = productRoutes.includes(location.pathname);

    const [openProduct, setOpenProduct] = useState(false);

    useEffect(() => {
        setOpenProduct(isProductActive);
    }, [isProductActive]);

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav">
                <li className="nav-item">
                    <NavLink to="/admin/track-your-activity" className="nav-link">
                        <i className="bi bi-file-person"></i>
                        <span>Track Your Activity</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/track-system-activity" className="nav-link">
                        <i className="ri-file-search-fill"></i>
                        <span>Track System Activity</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/auth-user-service" className="nav-link">
                        <i className="ri-shield-user-fill"></i>
                        <span>Auth User Management</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/user-service" className="nav-link">
                        <i className="ri-user-received-fill"></i>
                        <span>User Management</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/banner-service" className="nav-link">
                        <i className="bi bi-card-image"></i>
                        <span>Banner Management</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/language-service" className="nav-link">
                        <i className="ri-english-input"></i>
                        <span>Language Management</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <button type="button" onClick={() => setOpenProduct(prev => !prev)} className={`nav-link d-flex align-items-center w-100 border-0 ${openProduct ? "" : "collapsed"}`}>
                        <i className="ri-shopping-bag-3-line" />
                        <span className="ms-2">Product Management</span>
                        <i className="bi bi-chevron-down ms-auto" />
                    </button>
                    <ul className={`nav-content ${openProduct ? "" : "collapse"}`}>
                        <li>
                            <NavLink to="/admin/category-service">
                                <i className="bi bi-circle" />
                                <span>Manage Category</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/sub-category-service">
                                <i className="bi bi-circle" />
                                <span>Manage Subcategory</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/product-service">
                                <i className="bi bi-circle" />
                                <span>Manage Product</span>
                            </NavLink>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/wishlist-service" className="nav-link">
                        <i className="bx bx-bookmark-heart"></i>
                        <span>Wishlist Management</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/cart-service" className="nav-link">
                        <i className="bx bx-cart"></i>
                        <span>Cart Management</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/checkout-service" className="nav-link">
                        <i className="ri-secure-payment-fill"></i>
                        <span>Checkout Management</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/newsletter-service" className="nav-link">
                        <i className="bx bx-news"></i>
                        <span>Newsletter Management</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/support-service" className="nav-link">
                        <i className="bx bx-support"></i>
                        <span>Support</span>
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
