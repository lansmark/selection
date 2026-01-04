// src/components/GenderToggle/GenderToggle.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const GenderToggle = ({ currentGender, category, brand }) => {
  const navigate = useNavigate();

  const handleToggle = (newGender) => {
    if (newGender !== currentGender) {
      navigate(`/${newGender}/${category}/${brand}`);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-1 shadow-sm">
        {/* Women's Button */}
        <button
          onClick={() => handleToggle("women")}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 
                     ${currentGender === "women" 
                       ? "bg-pink-500 text-white shadow-md" 
                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
        >
          👗 Women's
        </button>

        {/* Men's Button */}
        <button
          onClick={() => handleToggle("men")}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 
                     ${currentGender === "men" 
                       ? "bg-blue-500 text-white shadow-md" 
                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
        >
          👔 Men's
        </button>
      </div>
    </div>
  );
};

export default GenderToggle;