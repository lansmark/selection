import React from "react";
import { useNavigate } from "react-router-dom";

const WomenWatches = () => {
  const navigate = useNavigate();

  const watchBrands = [
    { id: 1, name: "Emporio Armani", link: "/women/watches/emporio-armani", image: "/assets/watches/emporio-armani.jpg" },
    { id: 2, name: "Armani Exchange", link: "/women/watches/armani-exchange", image: "/assets/watches/armani-exchange.jpg" },
    { id: 3, name: "Guess", link: "/women/watches/guess", image: "/assets/watches/guess.jpg" },
    { id: 4, name: "Boss", link: "/women/watches/boss", image: "/assets/watches/boss.jpg" },
    { id: 5, name: "MK", link: "/women/watches/mk", image: "/assets/watches/mk.jpg" },
    { id: 6, name: "Cavalli", link: "/women/watches/cavalli", image: "/assets/watches/cavalli.jpg" },
  ];

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 dark:text-pink-400 mb-4">
            Women's Watches
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore our luxury watch collection for women
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {watchBrands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => navigate(brand.link)}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
            >
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    {brand.name}
                  </h3>
                  <p className="text-pink-600 dark:text-pink-400 font-semibold">
                    View Collection →
                  </p>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WomenWatches;
