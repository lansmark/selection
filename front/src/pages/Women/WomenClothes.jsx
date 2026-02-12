import React from "react";
import { useNavigate } from "react-router-dom";

const WomenClothes = () => {
  const navigate = useNavigate();

  const clothesBrands = [
    { id: 1, name: "Dolce & Gabbana", link: "/women/clothes/dolce-gabbana" },
    { id: 2, name: "Michael Kors", link: "/women/clothes/mk" },
    { id: 3, name: "Valentino", link: "/women/clothes/valentino" },
    { id: 4, name: "Armani", link: "/women/clothes/armani" },
  ];

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 dark:text-pink-400 mb-4">
            Women's Clothes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore our luxury clothing collection for women
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {clothesBrands.map((brand) => (
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

export default WomenClothes;
