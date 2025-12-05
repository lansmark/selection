// src/pages/Clothes/ClothesBrand.jsx
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import clothesDataFile from "../../assets/data/clothes-data.json";

const ClothesBrand = () => {
  const { brand } = useParams();
  const navigate = useNavigate();
  const normalizedBrand = brand?.toLowerCase();

  const allClothes = clothesDataFile?.clothes_data || [];

  const uniqueBrands = Array.from(new Set(allClothes.map(c => c.brand?.toLowerCase()))).filter(Boolean);

  const filteredClothes = allClothes.filter(c => c.brand?.toLowerCase() === normalizedBrand);

  if (filteredClothes.length === 0) {
    return (
      <section className="pt-40 text-center">
        <h2 className="text-3xl font-bold">No clothes found for “{brand}”</h2>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full">Back Home</Link>
      </section>
    );
  }

  return (
    <section className="pt-40 pb-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 capitalize">{brand} Collection</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredClothes.map(item => (
            <div key={item.id} className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <img src={item.imageFront} alt={item.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-4 flex flex-col justify-between">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-red-600 font-semibold">{item.price}</p>
                <button
                  onClick={() => navigate("/orders", { state: { product: item } })}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* brand links */}
        <div className="flex justify-center gap-4 mt-12 flex-wrap">
          {uniqueBrands.map(b => (
            <Link key={b} to={`/clothes/${b}`} className="px-4 py-2 bg-gray-100 rounded-full capitalize hover:bg-gray-200">{b}</Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClothesBrand;
