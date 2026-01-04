// src/components/Bags/Bags.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Bags = ({ title = "Bags Collection", autoplayDelay = 3500, data, gender = "women" }) => {
  const bagsData = data || [];

  // Extract unique brands dynamically
  const uniqueBagsBrands = Array.from(
    new Set(bagsData.map((bag) => bag.brand?.toLowerCase()))
  ).filter(Boolean);

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>

        {/* Swiper Slider */}
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
          {bagsData.map((item, index) => {
            const routeName = item.brand?.toLowerCase() || "unknown";

            return (
              <SwiperSlide key={item.id ?? index}>
                <div className="group bg-white dark:bg-gray-800 relative rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 h-80">

                  {/* Full cover image */}
                  <img
                    src={item.imageFront}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-gray-200 mb-4">{item.code}</p>
                    <p className="text-gray-200 mb-4">{item.price}</p>

                    <Link
                      to={`/${gender}/bags/${routeName}`}
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

        {/* Brand Links */}
        <div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
          {uniqueBagsBrands.map((brand) => (
            <Link
              key={brand}
              to={`/${gender}/bags/${brand}`}
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

export default Bags;