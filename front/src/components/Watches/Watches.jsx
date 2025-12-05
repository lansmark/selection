// src/components/Watches/Watches.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import watchesDataFile from "../../assets/data/watches-data.json";

const Watches = ({ title = "Watch Collection", autoplayDelay = 3500 }) => {
  const watchesData = watchesDataFile.watches_data || [];

  // Extract unique brands dynamically
  const uniqueWatchBrands = Array.from(
    new Set(watchesData.map((watch) => watch.brand?.toLowerCase()))
  ).filter(Boolean);

  return (
    <section className="watches py-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-700">
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
          {watchesData.map((watch, index) => {
            const routeName = watch.brand ? watch.brand.toLowerCase() : "unknown";

            return (
              <SwiperSlide key={watch.id ?? index}>
                <div
                  data-aos="fade-up"
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 relative"
                >
                  {/* Image */}
                  <img
                    src={watch.imageFront}
                    alt={watch.name}
                    className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 flex flex-col justify-center items-center text-center
                               bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <h3 className="text-lg font-semibold text-white">{watch.name}</h3>
                    <p className="text-gray-200 mb-4">{watch.price}</p>
                    <Link
                      to={`/watches/${routeName}`}
                      className="bg-white/90 text-gray-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-white transition"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Dynamic Brand Links */}
        <div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
          {uniqueWatchBrands.map((brand) => (
            <Link
              key={brand}
              to={`/watches/${brand}`}
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

export default Watches;
 

//Replaced all hardcoded brand <Link> elements with a dynamic map over uniqueWatchBrands.

//Added flex-wrap so the brand links wrap nicely on smaller screens.

//capitalize ensures the brand names display neatly.

//Everything else (Swiper, images, overlay) remains the same.

//Now, any new brands added to watches-data.json will automatically appear in the brand links — no manual updates required.

// like what i did with clothes 


  {/*   instead of hardcored links
    
    Brand navigation links 
        <div className="flex justify-center gap-6 mt-10 text-sm">
          <Link to="/watches/dior" className="hover:underline">
            Dior
          </Link>
          <Link to="/watches/chanel" className="hover:underline">
            Chanel
          </Link>
          <Link to="/watches/armani" className="hover:underline">
            Armani
          </Link>
          <Link to="/watches/oud" className="hover:underline">
            Oud
          </Link>
        </div>


i used:
<div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
          {uniqueWatchesBrands.map((brand) => (
            <Link
              key={brand}
              to={`/watches/${brand}`}
              className="hover:underline capitalize"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>




    i exactly did the following:

    1️⃣ Added dynamic brand extraction

I added this near the top of the component:

// Extract unique brands dynamically
const uniqueWatchesBrands = Array.from(
  new Set(watchesData.map((perfume) => perfume.brand?.toLowerCase()))
).filter(Boolean);

Purpose:

Collect all unique brands from your JSON.

Convert to lowercase for consistent URLs.

Filter out any null or undefined.


2️⃣ Replaced the hardcoded brand links

Original hardcoded links:

<div className="flex justify-center gap-6 mt-10 text-sm">
  <Link to="/watches/dior" className="hover:underline">Dior</Link>
  <Link to="/watches/chanel" className="hover:underline">Chanel</Link>
  <Link to="/watches/armani" className="hover:underline">Armani</Link>
  <Link to="/watches/oud" className="hover:underline">Oud</Link>
</div>


Modified dynamic version:

<div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
  {uniqueWatchesBrands.map((brand) => (
    <Link
      key={brand}
      to={`/watches/${brand}`}
      className="hover:underline capitalize"
    >
      {brand}
    </Link>
  ))}
</div>


Changes made here:

Loop through uniqueWatchesBrands using .map() instead of hardcoding each brand.

capitalize CSS class added to make the first letter uppercase for display.

flex-wrap ensures links wrap nicely on small screens.

        */}