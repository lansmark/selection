import React from "react";
import Heading from "../Shared/Heading";
import ProductCard from "./ProductCard";

// ✅ Import product images
import Img1 from "../../assets/product/boat-headphone.jpg";
import Img2 from "../../assets/product/rocky-mountain.jpg";
import Img3 from "../../assets/product/goggles.jpg";
import Img4 from "../../assets/product/printed.jpg";
import Img5 from "../../assets/product/p-5.jpg";
import Img6 from "../../assets/product/p-7.jpg";
import Img7 from "../../assets/product/p-9.jpg";
import Img8 from "../../assets/product/p-9.jpg"; // (Optional: replace duplicate later)

// ✅ Product data arrays
const ProductsData = [
  { id: 1, img: Img1, title: "Boat Headphone", price: "120", aosDelay: "0" },
  { id: 2, img: Img2, title: "Rocky Mountain", price: "420", aosDelay: "200" },
  { id: 3, img: Img3, title: "Goggles", price: "320", aosDelay: "400" },
  { id: 4, img: Img4, title: "Printed", price: "220", aosDelay: "600" },
];

const ProductsData2 = [
  { id: 5, img: Img5, title: "p-5", price: "110", aosDelay: "0" },
  { id: 6, img: Img6, title: "p-7", price: "220", aosDelay: "200" },
  { id: 7, img: Img7, title: "p-9", price: "320", aosDelay: "400" },
  { id: 8, img: Img8, title: "p-5", price: "410", aosDelay: "600" },
];

const Products = () => {
  return (
    <section
      className="py-16 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-700"
    >
      <div className="container mx-auto px-4 pb-8 sm:pb-0">
        {/* Heading */}
        <Heading title="Our Products" subtitle="Explore Our Products" />

        {/* Product grids */}
        <ProductCard data={ProductsData} />
        <ProductCard data={ProductsData2} />
      </div>
    </section>
  );
};

export default Products;
