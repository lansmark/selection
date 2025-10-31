import React from "react";
import Button from "../Shared/Button";
import HeroVideo from "../../assets/videos/new-sky-dweller-cover.webm"; // ✅ correct relative path
import FallbackImage from "../../assets/category/watch.png"; // optional fallback image

const Hero = ({ handleOrderPopup }) => {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden rounded-3xl my-10">
      {/* 🎥 Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={HeroVideo}
        autoPlay
        muted
        loop
        playsInline
        poster={FallbackImage} // 🖼️ fallback image before the video loads
      />

      {/* 🔳 Overlay (dark gradient for better readability) */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 💬 Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 text-white">
        <h1
          data-aos="zoom-out"
          data-aos-duration="800"
          data-aos-once="true"
          className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4"
        >
          Discover Timeless Luxury
        </h1>

        <p
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
          className="max-w-2xl text-gray-200 mb-8"
        >
          Experience precision craftsmanship and elegance in every second.
        </p>

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
      </div>
    </section>
  );
};

export default Hero;
