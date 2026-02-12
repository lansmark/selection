// App.jsx - UPDATED WITH SEPARATE CATEGORY COMPONENTS
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import Hero from "./components/Hero/Hero";
import CategoryWomen from "./components/Category/CategoryWomen";
import CategoryMen from "./components/Category/CategoryMen";
import Watches from "./components/Watches/Watches.jsx";
import Clothes from "./components/Clothes/Clothes.jsx";
import Bags from "./components/Bags/Bags.jsx";
import Perfumes from "./components/Perfumes/Perfumes.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Popup from "./components/Popup/Popup.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import AOS from "aos";
import "aos/dist/aos.css";

import Orders from "./pages/Orders/Orders.jsx";
import WatchesBrand from "./pages/Watches/WatchesBrand.jsx";
import ClothesBrand from "./pages/Clothes/ClothesBrand.jsx";
import BagsBrand from "./pages/Bags/BagsBrand.jsx";
import PerfumeBrand from "./pages/Perfumes/PerfumesBrand.jsx";

// Landing Pages
import Women from "./pages/Women/not-working-Women.jsx";
import Men from "./pages/Men/not-working-Men.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";

import CartPage from "./pages/Cart/CartPage";
import AddressPage from "./pages/Checkout/AddressPage";
import PaymentPage from "./pages/Checkout/PaymentPage";
import ConfirmationPage from "./pages/Checkout/ConfirmationPage";

import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import NotifyMe from "./pages/NotifyMe/NotifyMe.jsx";

function AppContent() {
  const [orderPopup, setOrderPopup] = useState(false);
  
  const { cart } = useCart();
  const cartCount = cart.length;

  const handleOrderPopup = () => setOrderPopup(!orderPopup);

  useEffect(() => {
    AOS.init({ duration: 2000, easing: "ease-in-sine", offset: 100 });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-white min-h-screen duration-200">
      <NavBar cartCount={cartCount} />

      {/* Main content with NO padding on homepage, padding on other pages */}
      <main>
        <Routes>
          {/* HOME PAGE - No padding, Hero goes full screen behind navbar */}
          <Route
            path="/"
            element={
              <>
                <Hero handleOrderPopup={handleOrderPopup} />

                {/* WOMEN'S SECTION */}
                <div className="bg-pink-50 dark:bg-pink-900/10 py-8">
                  {/* CategoryWomen - Shows women's category cards */}
                  <CategoryWomen />

                  <Watches
                    title="The Time Meister Collection"
                    gender="women"
                    autoplayDelay={3000}
                  />

                  <Clothes
                    title="Brand Clothes Collection"
                    gender="women"
                    autoplayDelay={3500}
                  />

                  <Bags
                    title="Luxury Bags Collection"
                    gender="women"
                    autoplayDelay={3500}
                  />

                  <Perfumes 
                    title="Luxury Perfumes Collection"
                    gender="women"
                    autoplayDelay={3500}
                  />
                </div>

                {/* MEN'S SECTION */}
                <div className="bg-blue-50 dark:bg-blue-900/10 py-8">
                  {/* CategoryMen - Shows men's category cards */}
                  <CategoryMen />

                  <Watches
                    title="Men's Watch Collection"
                    gender="men"
                    autoplayDelay={3000}
                  />

                  <Clothes
                    title="Men's Clothes Collection"
                    gender="men"
                    autoplayDelay={3500}
                  />

                  <Bags
                    title="Men's Bags Collection"
                    gender="men"
                    autoplayDelay={3500}
                  />

                  <Perfumes 
                    title="Men's Perfumes Collection"
                    gender="men"
                    autoplayDelay={3500}
                  />
                </div>
              </>
            }
          />

          {/* ALL OTHER PAGES - Need padding to not hide behind navbar */}
          <Route path="/watches/:brand" element={<div className="pt-20"><WatchesBrand /></div>} />
          <Route path="/clothes/:brand" element={<div className="pt-20"><ClothesBrand /></div>} />
          <Route path="/bags/:brand" element={<div className="pt-20"><BagsBrand /></div>} />
          <Route path="/perfumes/:brand" element={<div className="pt-20"><PerfumeBrand /></div>} />

          <Route path="/women" element={<div className="pt-20"><Women /></div>} />
          <Route path="/men" element={<div className="pt-20"><Men /></div>} />
          <Route path="/contact" element={<div className="pt-20"><Contact /></div>} />
          
          <Route path="/admin/login" element={<div className="pt-20"><AdminLogin /></div>} />
          <Route 
            path="/admin" 
            element={
              <div className="pt-20">
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              </div>
            } 
          />

          <Route path="/:gender/watches/:brand" element={<div className="pt-20"><WatchesBrand /></div>} />
          <Route path="/:gender/clothes/:brand" element={<div className="pt-20"><ClothesBrand /></div>} />
          <Route path="/:gender/bags/:brand" element={<div className="pt-20"><BagsBrand /></div>} />
          <Route path="/:gender/perfumes/:brand" element={<div className="pt-20"><PerfumeBrand /></div>} />

          <Route path="/cart" element={<div className="pt-20"><CartPage /></div>} />
          <Route path="/checkout/address" element={<div className="pt-20"><AddressPage /></div>} />
          <Route path="/checkout/payment" element={<div className="pt-20"><PaymentPage /></div>} />
          <Route path="/checkout/confirmation" element={<div className="pt-20"><ConfirmationPage /></div>} />

          <Route path="/orders" element={<div className="pt-20"><Orders /></div>} />
          <Route path="/notify-me" element={<div className="pt-20"><NotifyMe /></div>} />
        </Routes>
      </main>

      <Footer />
      <Popup orderPopup={orderPopup} handleOrderPopup={handleOrderPopup} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}