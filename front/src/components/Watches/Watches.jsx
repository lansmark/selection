// src/components/Watches/Watches.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const Watches = ({
  title = "Watch Collection", // default title
  data = [], // expects array of watch objects
  autoplayDelay = 2500,
}) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 pb-8 sm:pb-0">
        <h2
          className="text-center text-3xl sm:text-4xl font-bold uppercase mb-10"
          data-aos="fade-up"
        >
          {title}
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="watches"
        >
          {data.map((watch, index) => (
            <SwiperSlide key={index}>
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">

                <img
                  src={watch.src}
                  alt={watch.title}
                  className="w-full h-72 object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center transition-opacity duration-300">
                  <p className="text-lg font-semibold text-white">{watch.title}</p>
                  {watch.about && (
                    <p className="text-sm text-gray-300 text-center px-4">
                      {watch.about}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Watches;
