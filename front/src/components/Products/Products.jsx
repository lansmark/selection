import React from "react";
import Heading from "../Shared/Heading";
import ProductCard from "./ProductCard";

// Import JSON data
import watchesDataFile from "../../assets/data/watches-data.json";
import clothesDataFile from "../../assets/data/clothes-data.json";
import bagsDataFile from "../../assets/data/bags-data.json";
import perfumesDataFile from "../../assets/data/Perfumes-data.json";

const Products = () => {

  // Take first 4 products from each category
  const watches = (watchesDataFile.watches_data || []).slice(0, 4);
  const clothes = (clothesDataFile.clothes_data || []).slice(0, 4);
  const bags = (bagsDataFile.bags_data || []).slice(0, 4);
  const perfumes = (perfumesDataFile || []).slice(0, 4);

  // Convert each dataset into ProductCard format
  const mapToProductCard = (arr) =>
    arr.map((item, idx) => ({
      id: item.id,
      img: item.imageFront,
      title: item.name,
      price: item.price,
      aosDelay: `${idx * 200}`,
    }));

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-700">
      <div className="container mx-auto px-4 pb-8 sm:pb-0">
        
        <Heading title="Our Products" subtitle="Explore Our Products" />

        {/* Row 1: Watches */}
        <ProductCard data={mapToProductCard(watches)} />

        {/* Row 2: Clothes */}
        <ProductCard data={mapToProductCard(clothes)} />

        {/* Row 3: Bags */}
        <ProductCard data={mapToProductCard(bags)} />

        {/* Row 4: Perfumes */}
        <ProductCard data={mapToProductCard(perfumes)} />

      </div>
    </section>
  );
};

export default Products;
