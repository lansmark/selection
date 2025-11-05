import React from "react";
import { useParams } from "react-router-dom";
import perfumesData from "../../assets/data/Perfumes-data.json"; // ✅ correct path
import { Link } from "react-router-dom";

const PerfumesBrand = () => {
  const { brand } = useParams();

  // Normalize brand name from URL
  const normalizedBrand = brand?.toLowerCase();

  // Filter perfumes that match the brand name
  const filteredPerfumes = perfumesData.filter((perfume) =>
    perfume.name.toLowerCase().includes(normalizedBrand)
  );

  // Handle case: no perfumes found
  if (filteredPerfumes.length === 0) {
    return (
      <section className="py-20 text-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h2 className="text-3xl font-bold mb-4">No perfumes found for "{brand}"</h2>
        <Link
          to="/"
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-full hover:opacity-80 transition"
        >
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-700">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-12 capitalize">
          {brand} Collection
        </h2>

        {/* Perfume grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPerfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="group perspective cursor-pointer"
              data-aos="fade-up"
            >
              <div className="relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                {/* Front */}
                <div className="absolute inset-0 backface-hidden">
                  <img
                    src={perfume.imageFront}
                    alt={perfume.name}
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                  />
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden">
                  <img
                    src={perfume.imageBack}
                    alt={`${perfume.name} back`}
                    className="w-full h-full object-cover rounded-2xl"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-5 rounded-2xl">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">
                        {perfume.name}
                      </h3>
                      <p className="text-lg font-medium text-gray-200">
                        {perfume.price}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <Link
                        to="/shop"
                        className="bg-white/90 text-gray-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-white transition"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional navigation links */}
        <div className="flex justify-center gap-6 mt-12 text-sm">
          <Link to="/perfumes/dior" className="hover:underline">Dior</Link>
          <Link to="/perfumes/chanel" className="hover:underline">Chanel</Link>
          <Link to="/perfumes/armani" className="hover:underline">Armani</Link>
          <Link to="/perfumes/oud" className="hover:underline">Oud</Link>
        </div>
      </div>
    </section>
  );
};

export default PerfumesBrand;
