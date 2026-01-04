// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import Hero from "./components/Hero/Hero";
import Category from "./components/Category/Category";
import Watches from "./components/Watches/Watches.jsx";
import Clothes from "./components/Clothes/Clothes.jsx";
import Bags from "./components/Bags/Bags.jsx";
import Perfumes from "./components/Perfumes/Perfumes.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Popup from "./components/Popup/Popup.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import AOS from "aos";
import "aos/dist/aos.css";

// Women's data imports
import watchesDataWomen from "./assets/data/watches-data-women.json";
import clothesDataWomen from "./assets/data/clothes-data-women.json";
import bagsDataWomen from "./assets/data/bags-data-women.json";
import perfumesDataWomen from "./assets/data/perfumes-data-women.json";

// Men's data imports
import watchesDataMen from "./assets/data/watches-data-men.json";
import clothesDataMen from "./assets/data/clothes-data-men.json";
import bagsDataMen from "./assets/data/bags-data-men.json";
import perfumesDataMen from "./assets/data/perfumes-data-men.json";

import Orders from "./pages/Orders/Orders.jsx";
import WatchesBrand from "./pages/Watches/WatchesBrand.jsx";
import ClothesBrand from "./pages/Clothes/ClothesBrand.jsx";
import BagsBrand from "./pages/Bags/BagsBrand.jsx";
import PerfumeBrand from "./pages/Perfumes/PerfumesBrand.jsx";

// Landing Pages
import Women from "./pages/Women/Women.jsx";
import Men from "./pages/Men/Men.jsx";
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
      <NavBar handleOrderPopup={handleOrderPopup} cartCount={cartCount} />

      <main className="pt-24 sm:pt-28">
        <Routes>
          {/* HOME PAGE */}
          <Route
            path="/"
            element={
              <>
                <Hero handleOrderPopup={handleOrderPopup} />
                <Category />

                {/* WOMEN'S SECTION */}
                <div className="bg-pink-50 dark:bg-pink-900/10 py-8">
                  <h2 className="text-4xl font-bold text-center mb-8 text-pink-600 dark:text-pink-400">
                    Women's Collection
                  </h2>

                  <Watches
                    title="The Time Meister Collection"
                    data={watchesDataWomen.watches_data}
                    gender="women"
                    autoplayDelay={3000}
                  />

                  <Clothes
                    title="Brand Clothes Collection"
                    data={clothesDataWomen.clothes_data}
                    gender="women"
                    autoplayDelay={3500}
                  />

                  <Bags
                    title="Luxury Bags Collection"
                    data={bagsDataWomen.bags_data}
                    gender="women"
                    autoplayDelay={3500}
                  />

                  <Perfumes 
                    title="Luxury Perfumes Collection"
                    data={perfumesDataWomen}
                    gender="women"
                    autoplayDelay={3500}
                  />
                </div>

                {/* MEN'S SECTION */}
                <div className="bg-blue-50 dark:bg-blue-900/10 py-8">
                  <h2 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
                    Men's Collection
                  </h2>

                  <Watches
                    title="Men's Watch Collection"
                    data={watchesDataMen.watches_data}
                    gender="men"
                    autoplayDelay={3000}
                  />

                  <Clothes
                    title="Men's Clothes Collection"
                    data={clothesDataMen.clothes_data}
                    gender="men"
                    autoplayDelay={3500}
                  />

                  <Bags
                    title="Men's Bags Collection"
                    data={bagsDataMen.bags_data}
                    gender="men"
                    autoplayDelay={3500}
                  />

                  <Perfumes 
                    title="Men's Perfumes Collection"
                    data={perfumesDataMen}
                    gender="men"
                    autoplayDelay={3500}
                  />
                </div>
              </>
            }
          />

          {/* BRAND PAGES - OLD ROUTES (backward compatibility) */}
          <Route path="/watches/:brand" element={<WatchesBrand />} />
          <Route path="/clothes/:brand" element={<ClothesBrand />} />
          <Route path="/bags/:brand" element={<BagsBrand />} />
          <Route path="/perfumes/:brand" element={<PerfumeBrand />} />

          {/* LANDING PAGES */}
          <Route path="/women" element={<Women />} />
          <Route path="/men" element={<Men />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* ADMIN ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* BRAND PAGES - NEW GENDER-BASED ROUTES */}
          <Route path="/:gender/watches/:brand" element={<WatchesBrand />} />
          <Route path="/:gender/clothes/:brand" element={<ClothesBrand />} />
          <Route path="/:gender/bags/:brand" element={<BagsBrand />} />
          <Route path="/:gender/perfumes/:brand" element={<PerfumeBrand />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/address" element={<AddressPage />} />
          <Route path="/checkout/payment" element={<PaymentPage />} />
          <Route path="/checkout/confirmation" element={<ConfirmationPage />} />

          {/* ORDERS PAGE */}
          <Route path="/orders" element={<Orders />} />
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