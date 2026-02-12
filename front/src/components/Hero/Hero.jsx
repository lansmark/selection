import React from "react";
import Button from "../Shared/Button";
import HeroVideo from "../../assets/videos/new-sky-dweller-cover.webm";
import FallbackImage from "../../assets/category/watch.png";

const Hero = ({ handleOrderPopup }) => {
  return (
    <section className="relative w-full overflow-hidden">

      {/* Hero Wrapper - Full viewport height on all devices */}
      <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center">

        {/* Background Video - Fully responsive object-cover */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover bg-black"
          src={HeroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={FallbackImage}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content - Responsive padding for all screen sizes */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center text-white h-full pt-20 sm:pt-16 md:pt-0">
          
          {/* Hero Title - Fully responsive text sizes */}
          <h1
            data-aos="zoom-out"
            data-aos-duration="800"
            data-aos-once="true"
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-2xl uppercase tracking-tight"
          >
            Deepsea Challenge
          </h1>

          {/* Hero Subtitle - Responsive text and spacing */}
          <p
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="200"
            className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl text-gray-100 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg lg:text-xl capitalize px-4"
          >
            New Rolex Diving Watch
          </p>

          {/* Hero Button - Responsive sizing */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="800"
            className="mb-8 sm:mb-0"
          >
            <Button
              text="Shop By Category"
              bgColor="bg-red-500"
              textColor="text-white"
              handler={handleOrderPopup}
            />
          </div>

          {/* Scroll Down Arrow - Hide on very small screens, show on larger */}
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 animate-bounce hidden sm:block">
            <i className="fa-solid fa-chevron-down text-xl sm:text-2xl text-white opacity-80"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
