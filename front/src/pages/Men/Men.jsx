// src/pages/Men/Men.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Watches from "../../components/Watches/Watches";
import Clothes from "../../components/Clothes/Clothes";
import Bags from "../../components/Bags/Bags";
import Perfumes from "../../components/Perfumes/Perfumes";

import watchesDataMen from "../../assets/data/watches-data-men.json";
import clothesDataMen from "../../assets/data/clothes-data-men.json";
import bagsDataMen from "../../assets/data/bags-data-men.json";
import perfumesDataMen from "../../assets/data/perfumes-data-men.json";

const Men = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", offset: 100 });
  }, []);

  return (
    <div className="bg-linear-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6 text-blue-600 dark:text-blue-400"
            data-aos="fade-down"
          >
            Men's Collection
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Discover refined style, power, and sophistication in our curated selection of luxury men's fashion
          </p>
          
          {/* Category Cards */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link 
              to="/men/watches/emporio-armani"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">⌚</div>
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">Watches</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Timeless precision</p>
              </div>
            </Link>

            <Link 
              to="/men/clothes/dolce-gabbana"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">👔</div>
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">Clothes</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Sharp & stylish</p>
              </div>
            </Link>

            <Link 
              to="/men/bags/armani"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">💼</div>
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">Bags</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Professional carry</p>
              </div>
            </Link>

            <Link 
              to="/men/perfumes/dior"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">🎩</div>
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">Perfumes</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Bold fragrances</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Sections */}
      <div className="bg-white/50 dark:bg-gray-900/50">
        <Watches
          title="Men's Watches Collection"
          data={watchesDataMen.watches_data}
          gender="men"
          autoplayDelay={3000}
        />

        <Clothes
          title="Men's Fashion Collection"
          data={clothesDataMen.clothes_data}
          gender="men"
          autoplayDelay={3500}
        />

        <Bags
          title="Men's Luxury Bags"
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6" data-aos="fade-up">
            Upgrade Your Wardrobe
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Shop our exclusive men's collection and discover premium pieces that define modern masculinity
          </p>
          <Link
            to="/men/watches/emporio-armani"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
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

export default Men;