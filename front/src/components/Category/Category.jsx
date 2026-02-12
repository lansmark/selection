import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Image1 from "../../assets/category/watch-add-3.png";
import Image2 from "../../assets/category/bags-2.png";
import Image3 from "../../assets/category/clothes.png";
import Image4 from "../../assets/category/perfumes-6.png";
import Button from "../Shared/Button";

const Category = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: "ease-in-sine",
      offset: 100,
    });
    AOS.refresh();
  }, []);

  const handleNavigate = (gender, category) => {
    navigate(`/${gender}/${category}`);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 pb-8 sm:pb-0">
        
        {/* WOMEN'S SECTION */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-pink-600 dark:text-pink-400">
            Women's Collection
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* WOMEN'S WATCHES CARD */}
            <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-gradient-to-br from-black/90 to-black/70 text-white p-6 group cursor-pointer transition-transform hover:scale-105 duration-300">
              {/* Gender Badge */}
              <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                WOMEN
              </div>

              {/* TEXT */}
              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="z-10 max-w-[60%]"
              >
                <p className="text-sm text-gray-400">Enjoy</p>
                <h1
                  data-aos="zoom-out"
                  data-aos-delay="150"
                  className="text-4xl xl:text-4xl font-bold opacity-20"
                >
                  Watches
                </h1>
                <h2 className="text-2xl font-semibold ml-3 mb-4">Catalogue</h2>

                {/* BUTTON */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  onClick={() => handleNavigate('women', 'watches')}
                >
                  <Button text="Browse" bgColor="bg-red-500" textColor="text-white" />
                </div>
              </div>

              {/* IMAGE */}
              <img
                data-aos="zoom-in"
                data-aos-delay="200"
                src={Image1}
                alt="Women's Watches"
                className="absolute bottom-10 right-0 w-[220px] drop-shadow-2xl object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* WOMEN'S BAGS CARD */}
            <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-gradient-to-br from-brand-yellow to-brand-yellow/90 text-white p-6 group cursor-pointer transition-transform hover:scale-105 duration-300">
              {/* Gender Badge */}
              <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                WOMEN
              </div>

              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="z-10 max-w-[60%]"
              >
                <p className="text-sm">Enjoy</p>
                <h2 className="text-2xl font-semibold">With</h2>
                <h1
                  data-aos="zoom-out"
                  data-aos-delay="150"
                  className="uppercase text-4xl xl:text-5xl font-bold opacity-30 mb-4"
                >
                  Bags
                </h1>

                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  onClick={() => handleNavigate('women', 'bags')}
                >
                  <Button text="Browse" bgColor="bg-white" textColor="text-brand-yellow" />
                </div>
              </div>

              <img
                data-aos="zoom-in"
                data-aos-delay="200"
                src={Image2}
                alt="Women's Bags"
                className="absolute bottom-0 right-0 w-[300px] drop-shadow-2xl object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* WOMEN'S CLOTHES CARD */}
            <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-gradient-to-br from-pink-500 to-pink-700 text-white p-6 group cursor-pointer transition-transform hover:scale-105 duration-300">
              {/* Gender Badge */}
              <div className="absolute top-4 right-4 bg-white text-pink-600 text-xs font-bold px-3 py-1 rounded-full z-20">
                WOMEN
              </div>

              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="z-10 max-w-[60%]"
              >
                <p className="text-sm">Enjoy</p>
                <h2 className="text-2xl font-semibold">With</h2>
                <h1
                  data-aos="zoom-out"
                  data-aos-delay="150"
                  className="uppercase text-4xl xl:text-5xl font-bold opacity-30 mb-4"
                >
                  Clothes
                </h1>

                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  onClick={() => handleNavigate('women', 'clothes')}
                >
                  <Button text="Browse" bgColor="bg-white" textColor="text-pink-500" />
                </div>
              </div>

              <img
                data-aos="zoom-in"
                data-aos-delay="200"
                src={Image3}
                alt="Women's Clothes"
                className="absolute top-1/2 -translate-y-1/2 right-4 w-[250px] drop-shadow-2xl object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* WOMEN'S PERFUMES CARD */}
            <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between text-white p-6 bg-gradient-to-br from-purple-500 to-purple-700 group cursor-pointer transition-transform hover:scale-105 duration-300">
              {/* Gender Badge */}
              <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                WOMEN
              </div>

              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="z-10 max-w-[60%]"
              >
                <p className="text-sm">Enjoy</p>
                <h2 className="text-2xl font-semibold">With</h2>
                <h1
                  data-aos="zoom-out"
                  data-aos-delay="150"
                  className="uppercase text-4xl xl:text-5xl font-bold opacity-30 mb-4"
                >
                  Perfumes
                </h1>

                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  onClick={() => handleNavigate('women', 'perfumes')}
                >
                  <Button text="Browse" bgColor="bg-white" textColor="text-purple-500" />
                </div>
              </div>

              <img
                data-aos="zoom-in"
                data-aos-delay="200"
                src={Image4}
                alt="Women's Perfumes"
                className="absolute top-1/2 -translate-y-1/2 right-4 w-[250px] drop-shadow-2xl object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* MEN'S SECTION */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
            Men's Collection
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* MEN'S WATCHES CARD */}
            <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 group cursor-pointer transition-transform hover:scale-105 duration-300">
              {/* Gender Badge */}
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                MEN
              </div>

              {/* TEXT */}
              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="z-10 max-w-[60%]"
              >
                <p className="text-sm text-gray-400">Enjoy</p>
                <h1
                  data-aos="zoom-out"
                  data-aos-delay="150"
                  className="text-4xl xl:text-4xl font-bold opacity-20"
                >
                  Watches
                </h1>
                <h2 className="text-2xl font-semibold ml-3 mb-4">Catalogue</h2>

                {/* BUTTON */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  onClick={() => handleNavigate('men', 'watches')}
                >
                  <Button text="Browse" bgColor="bg-blue-500" textColor="text-white" />
                </div>
              </div>

              {/* IMAGE */}
              <img
                data-aos="zoom-in"
                data-aos-delay="200"
                src={Image1}
                alt="Men's Watches"
                className="absolute bottom-10 right-0 w-[220px] drop-shadow-2xl object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* MEN'S BAGS CARD */}
            <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 group cursor-pointer transition-transform hover:scale-105 duration-300">
              {/* Gender Badge */}
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                MEN
              </div>

              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="z-10 max-w-[60%]"
              >
                <p className="text-sm">Enjoy</p>
                <h2 className="text-2xl font-semibold">With</h2>
                <h1
                  data-aos="zoom-out"
                  data-aos-delay="150"
                  className="uppercase text-4xl xl:text-5xl font-bold opacity-30 mb-4"
                >
                  Bags
                </h1>

                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  onClick={() => handleNavigate('men', 'bags')}
                >
                  <Button text="Browse" bgColor="bg-blue-500" textColor="text-white" />
                </div>
              </div>

              <img
                data-aos="zoom-in"
                data-aos-delay="200"
                src={Image2}
                alt="Men's Bags"
                className="absolute bottom-0 right-0 w-[300px] drop-shadow-2xl object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* MEN'S CLOTHES CARD */}
            <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 group cursor-pointer transition-transform hover:scale-105 duration-300">
              {/* Gender Badge */}
              <div className="absolute top-4 right-4 bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full z-20">
                MEN
              </div>

              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="z-10 max-w-[60%]"
              >
                <p className="text-sm">Enjoy</p>
                <h2 className="text-2xl font-semibold">With</h2>
                <h1
                  data-aos="zoom-out"
                  data-aos-delay="150"
                  className="uppercase text-4xl xl:text-5xl font-bold opacity-30 mb-4"
                >
                  Clothes
                </h1>

                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  onClick={() => handleNavigate('men', 'clothes')}
                >
                  <Button text="Browse" bgColor="bg-white" textColor="text-blue-500" />
                </div>
              </div>

              <img
                data-aos="zoom-in"
                data-aos-delay="200"
                src={Image3}
                alt="Men's Clothes"
                className="absolute top-1/2 -translate-y-1/2 right-4 w-[250px] drop-shadow-2xl object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* MEN'S PERFUMES CARD */}
            <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between text-white p-6 bg-gradient-to-br from-teal-600 to-teal-800 group cursor-pointer transition-transform hover:scale-105 duration-300">
              {/* Gender Badge */}
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                MEN
              </div>

              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="z-10 max-w-[60%]"
              >
                <p className="text-sm">Enjoy</p>
                <h2 className="text-2xl font-semibold">With</h2>
                <h1
                  data-aos="zoom-out"
                  data-aos-delay="150"
                  className="uppercase text-4xl xl:text-5xl font-bold opacity-30 mb-4"
                >
                  Perfumes
                </h1>

                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  onClick={() => handleNavigate('men', 'perfumes')}
                >
                  <Button text="Browse" bgColor="bg-white" textColor="text-teal-600" />
                </div>
              </div>

              <img
                data-aos="zoom-in"
                data-aos-delay="200"
                src={Image4}
                alt="Men's Perfumes"
                className="absolute top-1/2 -translate-y-1/2 right-4 w-[250px] drop-shadow-2xl object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Category;