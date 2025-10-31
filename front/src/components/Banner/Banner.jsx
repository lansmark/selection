import React from "react";

const Banner = ({ data }) => {
  return (
    <section
      className="py-16 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-700"
    >
      <div className="container mx-auto px-4 pb-8 sm:pb-0">
        <div
          style={{ backgroundColor: data.bgColor }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-white rounded-3xl overflow-hidden shadow-md"
        >
          {/* Left column — discount + title + date */}
          <div className="p-6 sm:p-8 overflow-hidden">
            <p
              data-aos="slide-right"
              data-aos-delay="300"
              data-aos-duration="2500"
              data-aos-easing="ease-out-cubic"
              className="text-sm"
            >
              {data.discount}
            </p>

            <h1
              data-aos="zoom-out"
              data-aos-delay="150"
              className="uppercase text-4xl lg:text-7xl font-bold"
            >
              {data.title}
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="text-sm"
            >
              {data.date}
            </p>
          </div>

          {/* Center column — image */}
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            className="h-full flex justify-center"
          >
            <img
              src={data.image}
              alt={data.title}
              className="scale-125 w-[250px] md:w-[340px] mx-auto drop-shadow-2xl object-cover"
            />
          </div>

          {/* Right column — text + button */}
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 overflow-hidden">
            <h2
              data-aos="fade-left"
              data-aos-delay="150"
              className="text-xl font-bold"
            >
              {data.title2}
            </h2>
            <h3
              data-aos="fade-up"
              data-aos-delay="300"
              className="text-3xl sm:text-5xl font-bold"
            >
              {data.title3}
            </h3>
            <p
              data-aos="fade-up"
              data-aos-delay="450"
              className="text-sm tracking-wide leading-5"
            >
              {data.title4}
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-offset="0"
            >
              <button
                style={{ color: data.bgColor }}
                className="bg-white py-2 px-4 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300"
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
