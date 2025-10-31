import React from "react";
import Slider from "react-slick";
import Image1 from "../../assets/category/vr.png";
import Image2 from "../../assets/category/macbook.png";
import Image3 from "../../assets/category/earphone.png";
import Button from "../Shared/Button";

const HeroData = [
  {
    id: 1,
    img: Image1,
    subtitle: "Best Solo",
    title: "Wireless",
    title2: "Headphone",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    id: 2,
    img: Image2,
    subtitle: "Best Solo",
    title: "Powerful",
    title2: "Macbook",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    id: 3,
    img: Image3,
    subtitle: "Best Solo",
    title: "Stylish",
    title2: "Earphones",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
];

const Hero = ({ handleOrderPopup }) => {   // ✅ FIXED HERE
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="container mx-auto pb-8 sm:pb-0">
      <div
        className="overflow-hidden rounded-3xl min-h-[550px]
        sm:min-h-[650px] hero-bg-color flex items-center justify-center"
      >
        {/* hero section */}
        <Slider {...settings} className="w-full">
          {HeroData.map((data) => (
            <div key={data.id}>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6
                items-center justify-center px-6 sm:px-12"
              >
                 {/* text content section */}
                <div
                  className="flex flex-col justify-center gap-4
                  text-center sm:text-left order-2 sm:order-1"
                >
                  <h1 data-aos="zoom-out"
                  data-aos-duration="500"
                  data-aos-once="true"
                  className="text-2xl sm:text-6xl
                  lg:text-2xl font-bold">
                    {data.subtitle}
                  </h1>

                  <h1 data-aos="zoom-out"
                  data-aos-duration="500"
                  data-aos-once="true" 
                  className="text-5xl fsm:text-6xl
                   lg:text-7xl font-bold">
                    {data.title}
                  </h1>

                  <h1 data-aos="zoom-out"
                  data-aos-duration="500"
                  data-aos-once="true"
                  className="text-5xl uppercase text-white
                   sm:text-[80px] md:text-[100px]
                   xl:text-[150px] font-bold">
                    {data.title2}
                  </h1>

                  <p data-aos="zoom-out"
                  data-aos-duration="500"
                  data-aos-once="true"
                  className="text-gray-600 my-4 font-bold">
                    {data.description}</p>
                  
                  
                  <div
                  
                  data-aos="fade-up"
                  data-aos-offset="0"
                  data-aos-duration="500"
                  data-aos-delay="300"
                  
                  >
                    <Button 
                      text="Shop By Category"
                      bgColor="bg-red-500"
                      textColor="text-white"
                      handler={handleOrderPopup}   // ✅ Works now
                    />
                  </div>
                </div>

                  {/* Img section */}
                <div className="flex justify-center order-1 sm:order-2">

                  <div 
                  data-aos="zoom-in" 
                  data-aos-once="true"
                  className="relative z-10"
                  >
                  <img
                    src={data.img}
                    alt={data.title}
                    className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px]
                    sm:scale-105 lg:scale-110 object-contain mx-auto
                    drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)] relative z-40"
                  />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
