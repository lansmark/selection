import React from "react";
import {
  FaCarSide,
  FaHeadphones,
  FaWallet,
  FaCircleCheck,
} from "react-icons/fa6";

const Services = () => {
  const servicesData = [
    {
      id: 1,
      icon: <FaCarSide className="text-4xl md:text-5xl text-red-500" />,
      title: "Free Shipping",
      description: "Quickly and free.",
    },
    {
      id: 2,
      icon: <FaCircleCheck className="text-4xl md:text-5xl text-red-500" />,
      title: "Safe Money",
      description: "30 Days Money Back.",
    },
    {
      id: 3,
      icon: <FaWallet className="text-4xl md:text-5xl text-red-500" />,
      title: "Secure Payment",
      description: "All Payments Secure.",
    },
    {
      id: 4,
      icon: <FaHeadphones className="text-4xl md:text-5xl text-red-500" />,
      title: "24/7 Support",
      description: "Technical Support 24/7.",
    },
  ];

  return (
    <section
      className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-700 ease-in-out"
      id="services"
    >
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <h2
          className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white uppercase"
          data-aos="fade-up"
        >
          Our Services
        </h2>

        {/* Services Grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 place-items-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4
                         bg-white dark:bg-gray-800 rounded-xl shadow-md p-6
                         hover:shadow-lg transition-all duration-300 w-full max-w-xs sm:max-w-none"
            >
              {service.icon}
              <div className="text-center sm:text-left">
                <h3 className="lg:text-xl font-bold text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
