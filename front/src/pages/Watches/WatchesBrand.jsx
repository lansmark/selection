// src/pages/Watches/WatchesBrand.jsx
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import watchesDataFile from "../../assets/data/watches-data.json";

const WatchesBrand = () => {
  const { brand } = useParams();
  const navigate = useNavigate();
  const normalizedBrand = brand?.toLowerCase();

  const allWatches = watchesDataFile?.watches_data || [];

  const uniqueBrands = Array.from(new Set(allWatches.map(w => w.brand?.toLowerCase()))).filter(Boolean);

  const filteredWatches = allWatches.filter(w => w.brand?.toLowerCase() === normalizedBrand);

  if (filteredWatches.length === 0) {
    return (
      <section className="pt-40 text-center">
        <h2 className="text-3xl font-bold">No watches found for “{brand}”</h2>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full">Back Home</Link>
      </section>
    );
  }

  return (
    <section className="pt-40 pb-20">
      <style>{`
        .wb-perspective { perspective: 1200px; }
        .wb-flip { transition: transform .7s; transform-style: preserve-3d; position: relative; width:100%; height:100%; }
        .wb-face { backface-visibility: hidden; position: absolute; inset: 0; width:100%; height:100%; }
        .wb-back { transform: rotateY(180deg); }
        .wb-group:hover .wb-flip { transform: rotateY(180deg); }
      `}</style>

      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 capitalize">{brand} Collection</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredWatches.map(watch => (
            <div key={watch.id} className="wb-group wb-perspective cursor-pointer w-full h-80">
              <div className="wb-flip rounded-2xl relative w-full h-full">
                <div className="wb-face rounded-2xl overflow-hidden">
                  <img src={watch.imageFront} alt={`${watch.name} front`} className="w-full h-full object-cover" />
                </div>

                <div className="wb-face wb-back rounded-2xl overflow-hidden">
                  <img src={watch.imageBack} alt={`${watch.name} back`} className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-black/60 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl text-white">{watch.name}</h3>
                      <p className="text-gray-300">{watch.price}</p>
                    </div>

                    <button
                      onClick={() => navigate("/orders", { state: { product: watch } })}
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

        {/* Dynamic brand navigation */}
        <div className="flex justify-center gap-4 mt-12 flex-wrap">
          {uniqueBrands.map(b => (
            <Link key={b} to={`/watches/${b}`} className="px-4 py-2 bg-gray-100 rounded-full capitalize hover:bg-gray-200">{b}</Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WatchesBrand;
