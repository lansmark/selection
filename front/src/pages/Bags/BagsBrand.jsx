// src/pages/Bags/BagsBrand.jsx
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import bagsDataFile from "../../assets/data/bags-data.json";

const BagsBrand = () => {
  const { brand } = useParams();
  const navigate = useNavigate();
  const normalizedBrand = brand?.toLowerCase();

  const allBags = bagsDataFile?.bags_data || [];

  const uniqueBrands = Array.from(new Set(allBags.map(b => b.brand?.toLowerCase()))).filter(Boolean);

  const filteredBags = allBags.filter(b => b.brand?.toLowerCase() === normalizedBrand);

  if (filteredBags.length === 0) {
    return (
      <section className="pt-40 text-center">
        <h2 className="text-3xl font-bold">No bags found for “{brand}”</h2>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full">Back Home</Link>
      </section>
    );
  }

  return (
    <section className="pt-40 pb-20">
      <style>{`
        .bb-perspective { perspective: 1200px; }
        .bb-flip { transition: transform 0.7s; transform-style: preserve-3d; position: relative; width:100%; height:100%; }
        .bb-face { backface-visibility: hidden; position: absolute; inset: 0; width:100%; height:100%; }
        .bb-back { transform: rotateY(180deg); }
        .bb-group:hover .bb-flip { transform: rotateY(180deg); }
      `}</style>

      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 capitalize">{brand} Collection</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredBags.map(item => (
            <div key={item.id} className="bb-group bb-perspective cursor-pointer w-full h-80">
              <div className="bb-flip rounded-2xl relative w-full h-full">
                <div className="bb-face rounded-2xl overflow-hidden">
                  <img src={item.imageFront} alt={`${item.name} front`} className="w-full h-full object-cover" />
                </div>

                <div className="bb-face bb-back rounded-2xl overflow-hidden">
                  <img src={item.imageBack} alt={`${item.name} back`} className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-black/60 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl text-white">{item.name}</h3>
                      <p className="text-gray-300">{item.price}</p>
                    </div>

                    <button
                      onClick={() => navigate("/orders", { state: { product: item } })}
                      className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:opacity-90"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* brand nav */}
        <div className="flex justify-center gap-4 mt-12 flex-wrap">
          {uniqueBrands.map(b => (
            <Link key={b} to={`/bags/${b}`} className="px-4 py-2 bg-gray-100 rounded-full capitalize hover:bg-gray-200">{b}</Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BagsBrand;
