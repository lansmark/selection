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

import watchesData from "./assets/data/watches-data.json";
import clothesData from "./assets/data/clothes-data.json";
import bagsData from "./assets/data/bags-data.json";
import perfumesData from "./assets/data/Perfumes-data.json";

import Orders from "./pages/Orders/Orders.jsx";
import WatchesBrand from "./pages/Watches/WatchesBrand.jsx";
import ClothesBrand from "./pages/Clothes/ClothesBrand.jsx";
import BagsBrand from "./pages/Bags/BagsBrand.jsx";
import PerfumeBrand from "./pages/Perfumes/PerfumesBrand.jsx";


import CartPage from "./pages/Cart/CartPage";
import AddressPage from "./pages/Checkout/AddressPage";
import PaymentPage from "./pages/Checkout/PaymentPage";
import ConfirmationPage from "./pages/Checkout/ConfirmationPage";

export default function App() {
  const [orderPopup, setOrderPopup] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleOrderPopup = () => setOrderPopup(!orderPopup);

  useEffect(() => {
    AOS.init({ duration: 2000, easing: "ease-in-sine", offset: 100 });
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />

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

                  <Watches
                    title="The Time Meister Collection"
                    data={watchesData.watches_data}
                    autoplayDelay={3000}
                  />

                  <Clothes
                    title="Brand Clothes Collection"
                    data={clothesData.clothes_data}
                    autoplayDelay={3500}
                  />

                  <Bags
                    title="Luxury Bags Collection"
                    data={bagsData.bags_data}     // ✔ FIXED KEY
                    autoplayDelay={3500}
                  />

                  <Perfumes data={perfumesData} />
                </>
              }
            />

            {/* BRAND PAGES */}
            <Route path="/watches/:brand" element={<WatchesBrand />} />
            <Route path="/clothes/:brand" element={<ClothesBrand />} />
            <Route path="/bags/:brand" element={<BagsBrand />} />
            <Route path="/perfumes/:brand" element={<PerfumeBrand />} />

            
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout/address" element={<AddressPage />} />
            <Route path="/checkout/payment" element={<PaymentPage />} />
            <Route path="/checkout/confirmation" element={<ConfirmationPage />} />

            {/* ORDERS PAGE */}
            <Route
              path="/orders"
              element={
                <Orders
                  cartCount={cartCount}
                  setCartCount={setCartCount}
                />
              }
            />

          </Routes>
        </main>

        <Footer />
        <Popup orderPopup={orderPopup} handleOrderPopup={handleOrderPopup} />
      </div>
    </BrowserRouter>
  );
}
