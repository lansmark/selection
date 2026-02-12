// src/pages/Watches/WatchesBrand.jsx - FIXED DUPLICATE KEYS
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProductsByCategory } from "../../hooks/useProducts";
import { useBrands } from "../../hooks/useBrands";
import GenderToggle from "../../components/GenderToggle/GenderToggle";

const WatchesBrand = () => {
  const { brand, gender } = useParams();
  const navigate = useNavigate();
  const normalizedBrand = brand?.toLowerCase();
  const currentGender = gender || "women"; // Default to women if no gender in URL

  // Fetch watches from API with filters
  const { products: allWatches, loading, error } = useProductsByCategory('watches', {
    gender: currentGender,
    brand: normalizedBrand
  });

  // Get all unique brands for navigation (fetch all watches for this gender)
  const { products: allWatchesForGender } = useProductsByCategory('watches', { 
    gender: currentGender 
  });
  const uniqueBrands = useBrands(allWatchesForGender);

  if (loading) {
    return (
      <section className="pt-40 pb-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-40 text-center">
        <h2 className="text-3xl font-bold text-red-600">Error loading watches</h2>
        <p className="mt-4">{error}</p>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full">
          Back Home
        </Link>
      </section>
    );
  }

  if (allWatches.length === 0) {
    return (
      <section className="pt-40 text-center">
        <h2 className="text-3xl font-bold">No watches found for "{brand}"</h2>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full">
          Back Home
        </Link>
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
        {/* Gender Toggle */}
        <GenderToggle 
          currentGender={currentGender} 
          category="watches" 
          brand={normalizedBrand} 
        />

        <h2 className="text-3xl font-bold text-center mb-12 capitalize">
          {brand} {currentGender === "men" ? "Men's" : "Women's"} Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {allWatches.map(watch => (
            <div key={`watches-${watch.id}-${watch.code}`} className="wb-group wb-perspective cursor-pointer w-full h-80">
              <div className="wb-flip rounded-2xl relative w-full h-full">
                <div className="wb-face rounded-2xl overflow-hidden">
                  <img 
                    src={watch.image_front} 
                    alt={`${watch.name} front`} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="wb-face wb-back rounded-2xl overflow-hidden">
                  <img 
                    src={watch.image_back} 
                    alt={`${watch.name} back`} 
                    className="w-full h-full object-cover" 
                  />

                  <div className="absolute inset-0 bg-black/60 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl text-white">{watch.name}</h3>
                      <p className="text-gray-300">${watch.price}</p>
                      <p className="text-gray-300 text-sm">{watch.code}</p>
                      {watch.stock > 0 ? (
                        <p className="text-green-400 text-sm mt-2">In Stock: {watch.stock}</p>
                      ) : (
                        <p className="text-red-400 text-sm mt-2">Out of Stock</p>
                      )}
                    </div>

                    <button
                      onClick={() => navigate("/orders", { 
                        state: { 
                          product: {
                            ...watch,
                            category: 'watches' // Add category for order creation
                          } 
                        } 
                      })}
                      disabled={watch.stock === 0}
                      className={`${
                        watch.stock > 0
                          ? 'bg-white text-black hover:opacity-90'
                          : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      } px-5 py-2 rounded-full text-sm font-medium transition`}
                    >
                      {watch.stock > 0 ? 'Shop Now' : 'Out of Stock'}
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
            <Link 
              key={`brand-${b}`}
              to={`/${currentGender}/watches/${b}`}
              className={`px-4 py-2 rounded-full capitalize transition ${
                b === normalizedBrand
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {b}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WatchesBrand;