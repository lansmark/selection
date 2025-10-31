import React from "react";
import Image1 from "../../assets/category/gaming.png";
import Image2 from "../../assets/category/vr.png";
import Image3 from "../../assets/category/speaker.png";
import Button from "../Shared/Button";

const Category2 = () => {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 pb-8 sm:pb-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Gaming */}
          <div className="sm:col-span-2 relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-linear-to-br from-gray-400 to-gray-100 text-white p-6">
            <div
              data-aos="slide-right"
              data-aos-delay="300"
              className="z-10 max-w-[60%]"
            >
              <p className="text-sm text-white">Enjoy</p>
              <h2 className="text-2xl font-semibold">With</h2>
              <h1
                data-aos="zoom-out"
                data-aos-delay="150"
                className="uppercase text-4xl xl:text-5xl font-bold opacity-40 mb-4"
              >
                Gaming
              </h1>
              <Button text="Browse" bgColor="bg-red-500" textColor="text-white" />
            </div>
            <img
              data-aos="zoom-in"
              data-aos-delay="200"
              src={Image1}
              alt="Gaming"
              className="absolute top-1/2 -translate-y-1/2 right-0 w-[250px] drop-shadow-2xl object-cover"
            />
          </div>

          {/* VR */}
          <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-linear-to-br from-green-400/90 to-green-500/90 text-white p-6">
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
                className="uppercase text-4xl xl:text-5xl font-bold opacity-50 mb-4"
              >
                VR
              </h1>
              <Button text="Browse" bgColor="bg-white" textColor="text-green-600" />
            </div>
            <img
              data-aos="zoom-in"
              data-aos-delay="200"
              src={Image2}
              alt="VR"
              className="absolute bottom-0 right-0 w-[320px] drop-shadow-2xl object-cover"
            />
          </div>

          {/* Speaker */}
          <div className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-between bg-linear-to-br from-blue-400 to-blue-500 text-white p-6">
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
                className="uppercase text-4xl xl:text-5xl font-bold opacity-40 mb-4"
              >
                Speaker
              </h1>
              <Button text="Browse" bgColor="bg-white" textColor="text-blue-500" />
            </div>
            <img
              data-aos="zoom-in"
              data-aos-delay="200"
              src={Image3}
              alt="Speaker"
              className="absolute bottom-0 right-0 w-[200px] drop-shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category2;
