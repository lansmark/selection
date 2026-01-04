// src/pages/Women/Women.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Watches from "../../components/Watches/Watches";
import Clothes from "../../components/Clothes/Clothes";
import Bags from "../../components/Bags/Bags";
import Perfumes from "../../components/Perfumes/Perfumes";

import watchesDataWomen from "../../assets/data/watches-data-women.json";
import clothesDataWomen from "../../assets/data/clothes-data-women.json";
import bagsDataWomen from "../../assets/data/bags-data-women.json";
import perfumesDataWomen from "../../assets/data/perfumes-data-women.json";

const Women = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", offset: 100 });
  }, []);

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white dark:from-pink-900/10 dark:to-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6 text-pink-600 dark:text-pink-400"
            data-aos="fade-down"
          >
            Women's Collection
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Discover elegance, sophistication, and timeless beauty in our curated selection of luxury fashion
          </p>
          
          {/* Category Cards */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link 
              to="/women/watches/emporio-armani"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-48 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">⌚</div>
                <h3 className="text-lg font-bold text-pink-800 dark:text-pink-300">Watches</h3>
                <p className="text-sm text-pink-600 dark:text-pink-400">Timeless elegance</p>
              </div>
            </Link>

            <Link 
              to="/women/clothes/dolce-gabbana"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-48 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">👗</div>
                <h3 className="text-lg font-bold text-pink-800 dark:text-pink-300">Clothes</h3>
                <p className="text-sm text-pink-600 dark:text-pink-400">Fashion forward</p>
              </div>
            </Link>

            <Link 
              to="/women/bags/armani"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-48 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">👜</div>
                <h3 className="text-lg font-bold text-pink-800 dark:text-pink-300">Bags</h3>
                <p className="text-sm text-pink-600 dark:text-pink-400">Luxury handbags</p>
              </div>
            </Link>

            <Link 
              to="/women/perfumes/dior"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-48 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">🌸</div>
                <h3 className="text-lg font-bold text-pink-800 dark:text-pink-300">Perfumes</h3>
                <p className="text-sm text-pink-600 dark:text-pink-400">Signature scents</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Sections */}
      <div className="bg-white/50 dark:bg-gray-900/50">
        <Watches
          title="Women's Watches Collection"
          data={watchesDataWomen.watches_data}
          gender="women"
          autoplayDelay={3000}
        />

        <Clothes
          title="Women's Fashion Collection"
          data={clothesDataWomen.clothes_data}
          gender="women"
          autoplayDelay={3500}
        />

        <Bags
          title="Women's Luxury Bags"
          data={bagsDataWomen.bags_data}
          gender="women"
          autoplayDelay={3500}
        />

        <Perfumes
          title="Women's Perfumes Collection"
          data={perfumesDataWomen}
          gender="women"
          autoplayDelay={3500}
        />
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-400 to-pink-600 dark:from-pink-800 dark:to-pink-900">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6" data-aos="fade-up">
            Elevate Your Style
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Shop our exclusive women's collection and discover the perfect pieces to complement your unique style
          </p>
          <Link
            to="/women/watches/emporio-armani"
            className="inline-block bg-white text-pink-600 font-bold px-8 py-4 rounded-full hover:bg-pink-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Women;