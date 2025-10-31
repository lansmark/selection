import React from "react";
import Heading from "../Shared/Heading";

// ✅ Import images
import Img1 from "../../assets/blogs/blog-1.jpg";
import Img2 from "../../assets/blogs/blog-2.jpg";
import Img3 from "../../assets/blogs/blog-3.jpg";

// ✅ Blog data
const BlogData = [
  {
    title: "How to choose perfect smartwatch",
    subtitle:
      "Minima facere deserunt vero illo beatae deleniti eius dolores consequuntur, eligendi corporis maiores molestiae laudantium. Porro.",
    published: "Jan 20, 2024 by Dilshad",
    image: Img1,
    aosDelay: "0",
  },
  {
    title: "How to choose perfect gadget",
    subtitle:
      "Minima facere deserunt vero illo beatae deleniti eius dolores consequuntur, eligendi corporis maiores molestiae laudantium. Porro.",
    published: "Jan 20, 2024 by Satya",
    image: Img2,
    aosDelay: "200",
  },
  {
    title: "How to choose perfect VR headset",
    subtitle:
      "Minima facere deserunt vero illo beatae deleniti eius dolores consequuntur, eligendi corporis maiores molestiae laudantium. Porro.",
    published: "Jan 20, 2024 by Sabir",
    image: Img3,
    aosDelay: "400",
  },
];

const Blogs = () => {
  return (
    <section
      className="py-16 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-700"
    >
      <div className="container mx-auto px-4 pb-8 sm:pb-0">
        {/* Heading */}
        <Heading title="Recent News" subtitle="Explore Our Blogs" />

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {BlogData.map((blog) => (
            <div
              key={blog.title}
              data-aos="fade-up"
              data-aos-delay={blog.aosDelay}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-t-2xl">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-[220px] object-cover rounded-t-2xl hover:scale-105 duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {blog.published}
                </p>
                <h3 className="font-bold text-lg line-clamp-1">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {blog.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
