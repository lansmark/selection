import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Image1 from "../../assets/category/watch-add-3.png";
import Image2 from "../../assets/category/bags-2.png";
import Image3 from "../../assets/category/clothes.png";
import Image4 from "../../assets/category/perfumes-6.png";
import Button from "../Shared/Button";

const Category = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: "ease-in-sine",
      offset: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 pb-8 sm:pb-0">

        {/* 4 equal columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* CARD 1 */}
          <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-linear-to-br from-black/90 to-black/70 text-white p-6">

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
                className=" text-4xl xl:text-4xl font-bold opacity-20 "
              >
                Watches
              </h1>
              <h2 className="text-2xl font-semibold ml-3 mb-4">Catalogue</h2>
              

              {/* BUTTON */}
              <div
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <Button text="Browse" bgColor="bg-red-500" textColor="text-white" />
              </div>
            </div>

            {/* IMAGE */}
            <img
              data-aos="zoom-in"
              data-aos-delay="200"
              src={Image1}
              alt="Watches"
              className="absolute bottom-10 right-0 w-[220px] drop-shadow-2xl object-cover"
            />
          </div>

          {/* CARD 2 (yellow bags) */}
          <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-linear-to-br from-brand-yellow to-brand-yellow/90 text-white p-6">

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
              >
                <Button text="Browse" bgColor="bg-white" textColor="text-brand-yellow" />
              </div>
            </div>

            <img
              data-aos="zoom-in"
              data-aos-delay="200"
              src={Image2}
              alt="Bags"
              className="absolute bottom-0 right-0 w-[300px] drop-shadow-2xl object-cover"
            />
          </div>

          {/* CARD 3 */}
          <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-linear-to-br from-red-500 to-red-700 text-white p-6">

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
              >
                <Button text="Browse" bgColor="bg-white" textColor="text-red-500" />
              </div>
            </div>

            <img
              data-aos="zoom-in"
              data-aos-delay="200"
              src={Image3}
              alt="Clothes"
              className="absolute top-1/2 -translate-y-1/2 right-4 w-[250px] drop-shadow-2xl object-cover"
            />
          </div>

       {/* CARD 4 (same as card 2) */}
<div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between text-white p-6 bg-[#767C78]">

  {/* TEXT */}
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
              <Button text="Browse" bgColor="bg-white" textColor="text-red-500" />
            </div>
            <img
              data-aos="zoom-in"
              data-aos-delay="200"
              src={Image4}
              alt="Clothes"
              className="absolute top-1/2 -translate-y-1/2 right-4 w-[250px] drop-shadow-2xl object-cover"
            />

</div>



        </div>
      </div>
    </div>
  );
};

export default Category;
