// src/components/Bags/Bags.jsx - UPDATED FOR API
import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useProductsByCategory } from "../../hooks/useProducts";
import { useBrands } from "../../hooks/useBrands";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Bags = ({ title = "Bags Collection", autoplayDelay = 3500, gender = "women" }) => {
  // Fetch bags from API with gender filter
  const { products: bagsData, loading, error } = useProductsByCategory('bags', { gender });
  
  // Extract unique brands
  const uniqueBrands = useBrands(bagsData);

  if (loading) {
    return (
      <section className="bags py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bags py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <p className="text-red-600">Error loading bags: {error}</p>
        </div>
      </section>
    );
  }

  if (bagsData.length === 0) {
    return (
      <section className="bags py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">No bags available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bags py-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-700">
      <div className="container mx-auto px-4">
        {/* Title */}
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
          {bagsData.map((bag) => {
            const routeName = bag.brand?.toLowerCase() || "unknown";

            return (
              <SwiperSlide key={bag.id}>
                <div
                  data-aos="fade-up"
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 relative"
                >
                  {/* Image */}
                  <img
                    src={bag.image_front}
                    alt={bag.name}
                    className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 flex flex-col justify-center items-center text-center
                               bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <h3 className="text-lg font-semibold text-white">{bag.name}</h3>
                    <p className="text-gray-200 mb-2">${bag.price}</p>
                    <p className="text-gray-300 text-sm mb-4">{bag.code}</p>
                    
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

        {/* Dynamic Brand Links */}
        <div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
          {uniqueBrands.map((brand) => (
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