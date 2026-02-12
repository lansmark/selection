import React from "react";
import { useNavigate } from "react-router-dom";

const MenBags = () => {
  const navigate = useNavigate();

  const bagBrands = [
    { id: 1, name: "Armani", link: "/men/bags/armani" },
    { id: 2, name: "Emporio Armani", link: "/men/bags/emporio-armani" },
    { id: 3, name: "Guess", link: "/men/bags/guess" },
    { id: 4, name: "Michael Kors", link: "/men/bags/mk" },
  ];

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Men's Bags
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore our luxury bag collection for men
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bagBrands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => navigate(brand.link)}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    {brand.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">
                    View Collection →
                  </p>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenBags;
