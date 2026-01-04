// src/components/Clothes/Clothes.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Clothes = ({ title = "Clothes Collection", autoplayDelay = 3500, data, gender = "women" }) => {
  const clothesData = data || [];

  // Extract unique brands dynamically
  const uniqueClothesBrands = Array.from(
    new Set(clothesData.map((item) => item.brand?.toLowerCase()))
  ).filter(Boolean);

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-10"
        >
          {clothesData.map((item, index) => {
            const routeName = item.brand?.toLowerCase() || "unknown";

            return (
             <SwiperSlide key={item.id ?? index}>
            <div
              data-aos="fade-up"
              className="group bg-white dark:bg-gray-800 rounded-2xl 
                        shadow-md overflow-hidden hover:shadow-lg transition 
                        duration-300 relative flex justify-center items-center
                        h-72 sm:h-80 md:h-96"
            >
              <img
                src={item.imageFront}
                alt={item.name}
                className="w-full h-full object-cover object-top 
                          transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4">
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-gray-200 mb-4">{item.code}</p>
                <p className="text-gray-200 mb-4">{item.price}</p>

                <Link
                  to={`/${gender}/clothes/${routeName}`}
                  className="bg-white/90 text-gray-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-white transition"
                >
                  Browse Product
                </Link>
              </div>
            </div>
          </SwiperSlide>

            );
          })}
        </Swiper>

        {/* Dynamic Brand Links */}
        <div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
          {uniqueClothesBrands.map((brand) => (
            <Link
              key={brand}
              to={`/${gender}/clothes/${brand}`}
              className="hover:underline capitalize"
            >
              {brand}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Clothes;