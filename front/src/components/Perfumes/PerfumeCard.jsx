import React from "react";

const PerfumeCard = ({ name, price, imageFront, imageBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300">
      {/* 👇 Image flip on hover */}
      <div className="relative group">
        <img
          src={imageFront}
          alt={name}
          className="w-full h-64 object-cover group-hover:opacity-0 transition-opacity duration-500"
        />
        <img
          src={imageBack}
          alt={name}
          className="w-full h-64 object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </div>

      {/* 👇 Text section — smaller and more balanced */}
      <div className="p-3 text-center bg-white dark:bg-gray-800">
        <h2 className="font-semibold text-base text-gray-900 dark:text-white truncate">
          {name}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
          ${price}
        </p>
      </div>
    </div>
  );
};

export default PerfumeCard;
