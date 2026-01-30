import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginView from "./ui-components/admin/LoginView";
import TrackYourActivityView from "./ui-components/admin/TrackYourActivityView";
import TrackSystemActivityView from "./ui-components/admin/TrackSystemActivityView";
import AuthUserView from "./ui-components/admin/AuthUserView";
import UserView from "./ui-components/admin/UserView";
import BannerView from "./ui-components/admin/BannerView";
import LanguageView from "./ui-components/admin/LanguageView";
import Page404View from "./ui-components/admin/404View";
import ProductCategoryView from "./ui-components/admin/ProductCategoryView";
import ProductSubCategoryView from "./ui-components/admin/ProductSubCategoryView";
import ProductView from "./ui-components/admin/ProductView";
import WishlistView from "./ui-components/admin/WishlistView";
import PrivateRoute from "./PrivateRoute";
import CartView from "./ui-components/admin/CartView";
import NewsletterView from "./ui-components/admin/NewsletterView";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./PublicRoute";

export default function App() {

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const size = 64;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "/src/assets/react.svg";

    let angle = 0;
    let animationId;

    img.onload = () => {
      const animate = () => {
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate(angle);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();

        let link = document.querySelector("link[rel='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = canvas.toDataURL("image/png");
        angle += 0.01; // speed control
        animationId = requestAnimationFrame(animate);
      };
      animate();
    };

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginView />} />
            <Route path="/admin" element={<LoginView />} />
            <Route path="/admin/login" element={<LoginView />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/admin/track-your-activity" element={<TrackYourActivityView />} />
            <Route path="/admin/track-system-activity" element={<TrackSystemActivityView />} />
            <Route path="/admin/auth-user-service" element={<AuthUserView />} />
            <Route path="/admin/user-service" element={<UserView />} />
            <Route path="/admin/banner-service" element={<BannerView />} />
            <Route path="/admin/language-service" element={<LanguageView />} />
            <Route path="/admin/category-service" element={<ProductCategoryView />} />
            <Route path="/admin/sub-category-service" element={<ProductSubCategoryView />} />
            <Route path="/admin/product-service" element={<ProductView />} />
            <Route path="/admin/wishlist-service" element={<WishlistView />} />
            <Route path="/admin/cart-service" element={<CartView />} />
            <Route path="/admin/newsletter-service" element={<NewsletterView />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Page404View />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
