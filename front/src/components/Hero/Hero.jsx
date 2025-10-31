import React from "react";
import Button from "../Shared/Button";
import HeroVideo from "../../assets/videos/new-sky-dweller-cover.webm";
import FallbackImage from "../../assets/category/watch.png";

const Hero = ({ handleOrderPopup }) => {
  return (
    <section className="relative w-full overflow-hidden mb-10">

      {/* Hero Wrapper */}
      <div className="relative w-full h-[60vh] sm:h-[50vh] md:h-[80vh] lg:h-[100vh] flex items-center justify-center">

        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full
                     object-contain sm:object-contain md:object-cover lg:object-cover
                     bg-black"
          src={HeroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={FallbackImage}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content aligned with container */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center text-center text-white h-full">

          {/* Hero Title */}
          <h1
            data-aos="zoom-out"
            data-aos-duration="800"
            data-aos-once="true"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-4 leading-tight drop-shadow-lg "
          >
            Deepsea Challenge
          </h1>

          {/* Hero Subtitle */}
          <p
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="200"
            className="max-w-2xl text-gray-200 mb-8 text-sm sm:text-base md:text-lg capitalize"
          >
            New Rolex Diving Watch
          </p>

          {/* Hero Button */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="800"
          >
            <Button
              text="Shop By Category"
              bgColor="bg-red-500"
              textColor="text-white"
              handler={handleOrderPopup}
            />
          </div>

          {/* Scroll Down Arrow */}
          <div className="absolute bottom-10 animate-bounce">
            <i className="fa-solid fa-chevron-down text-2xl text-white opacity-80"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
