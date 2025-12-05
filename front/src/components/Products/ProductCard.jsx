import React from 'react'
import Button from '../Shared/Button'

const ProductCard = ({ data }) => {
  return (
    <div className="mb-10">
      {/* Grid container for all product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 place-items-center">
        {data.map((item) => (
          <div
            key={item.id}
            data-aos="fade-up"
            data-aos-delay={item.aosDelay}
            className="group w-full max-w-[260px]"
          >
            {/* Image Section */}
            <div className="relative">
              <img
                src={item.img}
                alt={item.title}
                className="h-[220px] w-full object-cover rounded-md"
              />

              {/* Hover Button */}
              <div
                className="hidden group-hover:flex absolute inset-0 
                backdrop-blur-sm justify-center items-center duration-300"
              >
                <Button
                  text="Add to Cart"
                  bgColor="bg-red-500"
                  textColor="text-white"
                />
              </div>
            </div>

            {/* Text Section */}
            <div className="leading-7 text-center mt-3">
              <h2 className="font-semibold">{item.title}</h2>
               {String(item.price).includes("$") ? item.price : `$${item.price}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductCard
