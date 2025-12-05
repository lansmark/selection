import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import perfumesDataFile from "../../assets/data/Perfumes-data.json";

const PerfumeBrand = () => {
  const { brand } = useParams();
  const navigate = useNavigate();

  const normalizedBrand = brand?.toLowerCase();

  // Correct new JSON structure
  const allPerfumes = perfumesDataFile.perfumes_data || [];

  // Unique brands
  const uniqueBrands = Array.from(
    new Set(allPerfumes.map((p) => p.brand?.toLowerCase()))
  ).filter(Boolean);

  // Filter perfumes by brand
  const filteredPerfumes = allPerfumes.filter(
    (p) => p.brand?.toLowerCase() === normalizedBrand
  );

  if (filteredPerfumes.length === 0) {
    return (
      <section className="pt-40 text-center">
        <h2 className="text-3xl font-bold">No perfumes found for “{brand}”</h2>
        <Link
          to="/"
          className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full hover:animate-selectBrandLift"
        >
          Back Home
        </Link>
      </section>
    );
  }

  return (
    <section className="pt-40 pb-20">
      <style>{`
        .pb-perspective { perspective: 1200px; }
        .pb-flip { transition: transform 0.7s; transform-style: preserve-3d; position: relative; width:100%; height:100%; }
        .pb-face { backface-visibility: hidden; position: absolute; inset: 0; width:100%; height:100%; }
        .pb-back { transform: rotateY(180deg); }
        .pb-group:hover .pb-flip { transform: rotateY(180deg); }
      `}</style>

      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 capitalize">
          {brand} Collection
        </h2>

        {/* Perfume Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPerfumes.map((item) => (
            <div key={item.id} className="pb-group pb-perspective cursor-pointer w-full h-80">
              <div className="pb-flip rounded-2xl relative w-full h-full">
                <div className="pb-face rounded-2xl overflow-hidden">
                  <img
                    src={item.imageFront}
                    alt={`${item.name} front`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="pb-face pb-back rounded-2xl overflow-hidden">
                  <img
                    src={item.imageBack}
                    alt={`${item.name} back`}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/60 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl text-white">{item.name}</h3>
                      <p className="text-gray-300">{item.price}</p>
                    </div>

                    <button
                      onClick={() => navigate("/orders", { state: { product: item } })}
                      className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 hover:animate-selectBrandLift"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Navigation */}
        <div className="flex justify-center gap-4 mt-12 flex-wrap">
          {uniqueBrands.map((b) => (
            <Link
              key={b}
              to={`/perfumes/${b}`}
              className="px-4 py-2 bg-gray-100 rounded-full capitalize hover:bg-gray-200 hover:animate-selectBrandLift"
            >
              {b}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerfumeBrand;
