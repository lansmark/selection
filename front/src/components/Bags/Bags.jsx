import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import bagsDataFile from "../../assets/data/bags-data.json";

const Bags = ({ title = "Bags Collection", autoplayDelay = 3500 }) => {
  const bagsData = bagsDataFile.bags_data || [];

  // Extract unique brands for dynamic links
  const uniqueBagBrands = Array.from(
    new Set(bagsData.map((item) => item.brand?.toLowerCase()))
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
          {bagsData.map((item) => {
            const routeName = item.brand.toLowerCase();

            return (
              <SwiperSlide key={item.id}>
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
<p className="text-gray-200 mb-4">{item.price}</p>


<Link
to={`/bags/${routeName}`}
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

        {/* Brand Links */}
        <div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
          {uniqueBagBrands.map((brand) => (
            <Link
              key={brand}
              to={`/bags/${brand}`}
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


  {/*   instead of hardcored links
    
    Brand navigation links 
        <div className="flex justify-center gap-6 mt-10 text-sm">
          <Link to="/perfumes/dior" className="hover:underline">
            Dior
          </Link>
          <Link to="/perfumes/chanel" className="hover:underline">
            Chanel
          </Link>
          <Link to="/perfumes/armani" className="hover:underline">
            Armani
          </Link>
          <Link to="/perfumes/oud" className="hover:underline">
            Oud
          </Link>
        </div>


i used:
<div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
          {uniquePerfumeBrands.map((brand) => (
            <Link
              key={brand}
              to={`/perfumes/${brand}`}
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
const uniqueBagsBrands = Array.from(
  new Set(bagsData.map((perfume) => bags.brand?.toLowerCase()))
).filter(Boolean);

Purpose:

Collect all unique brands from your JSON.

Convert to lowercase for consistent URLs.

Filter out any null or undefined.


2️⃣ Replaced the hardcoded brand links

Original hardcoded links:

<div className="flex justify-center gap-6 mt-10 text-sm">
  <Link to="/bags/dior" className="hover:underline">Dior</Link>
  <Link to="/bags/chanel" className="hover:underline">Chanel</Link>
  <Link to="/bags/armani" className="hover:underline">Armani</Link>
  <Link to="/bags/oud" className="hover:underline">Oud</Link>
</div>


Modified dynamic version:

<div className="flex justify-center gap-6 mt-10 text-sm flex-wrap">
  {uniqueBagsBrands.map((brand) => (
    <Link
      key={brand}
      to={`/bags/${brand}`}
      className="hover:underline capitalize"
    >
      {brand}
    </Link>
  ))}
</div>


Changes made here:

Loop through uniqueBagsBrands using .map() instead of hardcoding each brand.

capitalize CSS class added to make the first letter uppercase for display.

flex-wrap ensures links wrap nicely on small screens.

        */}
