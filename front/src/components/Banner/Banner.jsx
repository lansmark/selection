import React from "react";

const Banner = ({ data }) => {
  return (
    <section
      className="py-16 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-700"
    >
      <div className="container mx-auto px-4 pb-8 sm:pb-0">

        <div
          className={`relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center rounded-3xl shadow-md 
          ${data.bgClass ? data.bgClass : "text-white"} 
          px-4 sm:px-6`}   // 👈 Add padding to prevent overlap
          style={!data.bgClass ? { backgroundColor: data.bgColor } : {}}
        >

          {/* Left column — discount + title + date */}
          <div className="p-4 sm:p-6 overflow-hidden">
            <p
              data-aos="slide-right"
              data-aos-delay="300"
              data-aos-duration="2500"
              data-aos-easing="ease-out-cubic"
              className="text-xs sm:text-sm"
            >
              {data.discount}
            </p>

            <h1
              data-aos="zoom-out"
              data-aos-delay="150"
              className="uppercase text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            >
              {data.title}
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="text-xs sm:text-sm"
            >
              {data.date}
            </p>
          </div>

          {/* Center column — image */}
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            className="relative h-full flex justify-center overflow-visible"
          >
            <img
              src={data.image}
              alt={data.title}
              className={`
                w-60 sm:w-[260px] md:w-[340px] 
                absolute
                -right-4 sm:-right-6 md:-right-12
                top-1/2 -translate-y-1/2
                drop-shadow-2xl
                object-contain
                ${data.className || ""}
              `}
            />
          </div>

          {/* Right column — text + button */}
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 overflow-hidden">
            <h2
              data-aos="fade-left"
              data-aos-delay="150"
              className="text-lg sm:text-xl font-bold"
            >
              {data.title2}
            </h2>

            <h3
              data-aos="fade-up"
              data-aos-delay="300"
              className="text-2xl sm:text-5xl font-bold"
            >
              {data.title3}
            </h3>

            <p
              data-aos="fade-up"
              data-aos-delay="450"
              className="text-xs sm:text-sm tracking-wide leading-5"
            >
              {data.title4}
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-offset="0"
            >
              <button
                style={{ color: data.bgColor, backgroundColor: data.buttonBg || "white" }}
                className="py-2 px-4 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300"
              >
                Shop Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
