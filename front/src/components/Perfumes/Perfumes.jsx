// src/components/Perfumes/Perfumes.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Perfumes = ({ title = "Perfume Collection", autoplayDelay = 3500, data, gender = "women" }) => {
  const navigate = useNavigate();

  // Extract perfumes_data from the data object
  const perfumesData = data?.perfumes_data || [];

  // Extract unique brands dynamically
  const uniquePerfumeBrands = Array.from(
    new Set(perfumesData.map((perfume) => perfume.brand?.toLowerCase()))
  ).filter(Boolean);

  return (
    <section className="perfumes py-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-700">
      <div className="container mx-auto px-4">
        {/* Title */}
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
          {perfumesData.map((perfume, index) => {
            const routeName = perfume.brand?.toLowerCase() || "unknown";

            return (
              <SwiperSlide key={perfume.id ?? index}>
                <div
                  data-aos="fade-up"
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 relative"
                >
                  {/* Image */}
                  <img
                    src={perfume.imageFront}
                    alt={perfume.name}
                    className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <h3 className="text-lg font-semibold text-white">{perfume.name}</h3>
                    <p className="text-gray-200 mb-4">{perfume.code}</p>
                    <p className="text-gray-200 mb-4">{perfume.price}</p>

                    <button
                      onClick={() => navigate(`/${gender}/perfumes/${routeName}`)}
                      className="bg-white/90 text-gray-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-white transition hover:animate-selectBrandLift"
                    >
                      Browse Product
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Dynamic Brand Links */}
        <div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
          {uniquePerfumeBrands.map((brand) => (
            <Link
              key={brand}
              to={`/${gender}/perfumes/${brand}`}
              className="hover:underline capitalize hover:animate-selectBrandLift"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Perfumes;