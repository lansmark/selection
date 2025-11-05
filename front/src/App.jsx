import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Hero from "./components/Hero/Hero";
import Category from "./components/Category/Category";
import Category2 from "./components/Category/Category2";
import Services from "./components/Services/Services";
import Banner from "./components/Banner/Banner";
import Products from "./components/Products/Products";
import Blogs from "./components/Blogs/Blogs";
import Partners from "./components/Partners/Partners";
import Footer from "./components/Footer/Footer.jsx";
import Popup from "./components/Popup/Popup.jsx";

import headphone from "./assets/hero/headphone.png";
import smartwatch2 from "./assets/Category/smartwatch2-removebg-preview.png";

import AOS from "aos";
import "aos/dist/aos.css";

import Watches from "./components/Watches/Watches.jsx";
import watchesData from "./assets/data/watches-data.json";
import clothesData from "./assets/data/clothes-data.json";
import Clothes from "./components/Clothes/Clothes.jsx";
import Bags from "./components/Bags/Bags.jsx";
import bagsData from "./assets/data/bags-data.json";
import Perfumes from "./components/Perfumes/Perfumes.jsx";


// ✅ Corrected perfume pages imports
//import Dior from "./pages/Perfumes/Dior.jsx";
//import Chanel from "./pages/Perfumes/Chanel.jsx";
//import Armani from "./pages/Perfumes/Armani.jsx";
//import Oud from "./pages/Perfumes/Oud.jsx";

import PerfumesBrand from "./pages/Perfumes/PerfumesBrand.jsx";



const bannerData = {
  discount: "30% OFF",
  title: "Fine Smile",
  date: "10 Jan to 28 Jan",
  image: headphone,
  title2: "Air Solo Bass",
  title3: "Winter Sale",
  title4:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque recusandae reiciendis.",
  bgColor: "#f42c37",
};

const bannerData2 = {
  discount: "30% OFF",
  title: "Happy Hours",
  date: "14 Jan to 28 Jan",
  image: smartwatch2,
  title2: "Smart Solo",
  title3: "Winter Sale",
  title4:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque recusandae reiciendis.",
  bgColor: "#2dcc6f",
};

export default function App() {
  const [orderPopup, setOrderPopup] = React.useState(false);
  const handleOrderPopup = () => setOrderPopup(!orderPopup);

  React.useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: "ease-in-sine",
      offset: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-gray-50 dark:bg-gray-900 dark:text-white duration-200 min-h-screen overflow-hidden">
        <NavBar handleOrderPopup={handleOrderPopup} />

        <main>
          <Routes>
            {/* ✅ Home Page */}
            <Route
              path="/"
              element={
                <>
                  <section className="section section-spacing">
                    <Hero handleOrderPopup={handleOrderPopup} />
                  </section>

                  <section className="section section-spacing">
                    <Watches
                      title="The Time Meister Collection"
                      data={watchesData.watches_data}
                      autoplayDelay={3000}
                    />
                  </section>

                  <section className="section section-spacing">
                    <Category />
                  </section>

                  <section className="section section-spacing">
                    <Banner data={bannerData} />
                  </section>

                  <section className="section section-spacing">
                    <Clothes
                      title="Brand Clothes Collection"
                      data={clothesData["clothes-data"]}
                      autoplayDelay={3500}
                    />
                  </section>

                  <section className="section section-spacing">
                    <Category2 />
                  </section>

                  <Bags
                    title="Luxury Bags Collection"
                    data={bagsData["bags-data"]}
                    autoplayDelay={3500}
                  />

                  <section className="section section-spacing">
                    <Category />
                  </section>

                  <section className="section section-spacing">
                    <Banner data={bannerData2} />
                  </section>

                  <section className="section section-spacing">
                    <Perfumes />
                  </section>

                  <section className="section section-spacing">
                    <Products />
                  </section>

                  <section className="section section-spacing">
                    <Services />
                  </section>

                  <section className="section section-spacing">
                    <Blogs />
                  </section>

                  <section className="section section-spacing">
                    <Partners />
                  </section>
                </>
              }
            />

            {/* ✅ Perfume Pages */}
           {/* Perfume Pages */}

<Route path="/perfumes/:brand" element={<PerfumesBrand />} />

          </Routes>



        </main>

        <Footer />
        <Popup orderPopup={orderPopup} handleOrderPopup={handleOrderPopup} />
      </div>
    </BrowserRouter>
  );
}
