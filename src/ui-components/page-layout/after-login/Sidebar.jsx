import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {

    const { t } = useTranslation();
    const location = useLocation();
    const [openAuth, setOpenAuth] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);

    const authRoutes = [
        "/bms-book-store/admin/auth-user-service",
        "/bms-book-store/admin/auth-permission"
    ];
    const isAuthActive = authRoutes.includes(location.pathname);

    const productRoutes = [
        "/bms-book-store/admin/category-service",
        "/bms-book-store/admin/sub-category-service",
        "/bms-book-store/admin/product-service"
    ];
    const isProductActive = productRoutes.includes(location.pathname);

    useEffect(() => {
        setOpenAuth(isAuthActive);
        setOpenProduct(isProductActive);
    }, [isAuthActive, isProductActive, t]);

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav">
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/track-your-activity" className="nav-link">
                        <i className="bi bi-file-person"></i>
                        <span>{t('track_your_activites.header_title')}</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/track-system-activity" className="nav-link">
                        <i className="ri-file-search-fill"></i>
                        <span>{t('track_system_activites.header_title')}</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <button type="button" onClick={() => setOpenAuth(prev => !prev)} className={`nav-link d-flex align-items-center w-100 border-0 ${openAuth ? "" : "collapsed"}`}>
                        <i className="ri-shopping-bag-3-line" />
                        <span className="ms-2">{t('auth_management.header_title')}</span>
                        <i className="bi bi-chevron-down ms-auto" />
                    </button>
                    <ul className={`nav-content ${openAuth ? "" : "collapse"}`}>
                        <li>
                            <NavLink to="/bms-book-store/admin/auth-user-service">
                                <i className="bi bi-circle" />
                                <span>Manage Auth Users</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/bms-book-store/admin/auth-permission">
                                <i className="bi bi-circle" />
                                <span>Manage Auth Permission</span>
                            </NavLink>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/user-service" className="nav-link">
                        <i className="ri-user-received-fill"></i>
                        <span>{t('user_management.header_title')}</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/banner-service" className="nav-link">
                        <i className="bi bi-card-image"></i>
                        <span>{t('banner_management.header_title')}</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/language-service" className="nav-link">
                        <i className="ri-english-input"></i>
                        <span>{t('language_management.header_title')}</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <button type="button" onClick={() => setOpenProduct(prev => !prev)} className={`nav-link d-flex align-items-center w-100 border-0 ${openProduct ? "" : "collapsed"}`}>
                        <i className="ri-shopping-bag-3-line" />
                        <span className="ms-2">{t('product_management.header_title')}</span>
                        <i className="bi bi-chevron-down ms-auto" />
                    </button>
                    <ul className={`nav-content ${openProduct ? "" : "collapse"}`}>
                        <li>
                            <NavLink to="/bms-book-store/admin/category-service">
                                <i className="bi bi-circle" />
                                <span>{t('product_management.manage_categories.header_title')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/bms-book-store/admin/sub-category-service">
                                <i className="bi bi-circle" />
                                <span>{t('product_management.manage_sub_categories.header_title')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/bms-book-store/admin/product-service">
                                <i className="bi bi-circle" />
                                <span>{t('product_management.manage_products.header_title')}</span>
                            </NavLink>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/wishlist-service" className="nav-link">
                        <i className="bx bx-bookmark-heart"></i>
                        <span>{t('favourites_management.header_title')}</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/cart-service" className="nav-link">
                        <i className="bx bx-cart"></i>
                        <span>{t('carts_management.header_title')}</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/checkout-service" className="nav-link">
                        <i className="ri-secure-payment-fill"></i>
                        <span>{t('checkout_management.header_title')}</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/newsletter-service" className="nav-link">
                        <i className="bx bx-news"></i>
                        <span>{t('newsletters_management.header_title')}</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/bms-book-store/admin/support-service" className="nav-link">
                        <i className="bx bx-support"></i>
                        <span>{t('manage_support_tickets.header_title')}</span>
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}
