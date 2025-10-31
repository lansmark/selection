import React from "react";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaCaretDown, FaCartShopping } from "react-icons/fa6";
import DarkMode from "./DarkMode";



const MenuLinks = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Shop", link: "/shop" },
  { id: 3, name: "About", link: "/about" },
  { id: 4, name: "Blogs", link: "/blogs" },
];

const DropdownLinks = [
  { id: 1, name: "Trending Products", link: "/" },
  { id: 2, name: "Best Selling", link: "/" },
  { id: 3, name: "Top Rated", link: "/" },
];

const NavBar = ({ handleOrderPopup }) => {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-white/70 
                 dark:bg-gray-900/70 text-gray-800 dark:text-white shadow-sm transition-all duration-300"
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
        {/* ===== Left — Menu Links ===== */}
        <div className="hidden lg:flex items-center gap-6 font-semibold relative">
          {MenuLinks.map((data) => (
            <Link
              key={data.id}
              to={data.link}
              className="hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200"
            >
              {data.name}
            </Link>
          ))}

          {/* ===== Hover Dropdown ===== */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300 
                         hover:text-red-700 dark:hover:text-red-400 transition-colors"
            >
              Quick Links
              <FaCaretDown className="transition-transform duration-300 group-hover:rotate-180" />
            </button>

            {/* Dropdown menu */}
            <div
              className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 
                         rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                         group-hover:translate-y-1 transform transition-all duration-300 ease-out z-50"
            >
              <ul className="py-2">
                {DropdownLinks.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                                 hover:bg-red-500/20 hover:text-red-700 dark:hover:text-white transition-colors rounded-md"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Center — Logo ===== */}
        <div className="flex justify-center items-center">
          <Link
            to="/"
            className="text-red-700 dark:text-red-400 text-2xl sm:text-3xl font-bold tracking-widest uppercase"
          >
            Selection
          </Link>
        </div>

        {/* ===== Right — Search, Cart, Dark Mode ===== */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search here..."
              className="pl-4 pr-10 py-2 rounded-full border border-gray-300 dark:border-gray-700 
                         bg-white/60 dark:bg-gray-800/60 text-sm focus:outline-none 
                         focus:ring-2 focus:ring-red-500 transition-all duration-200"
            />
            <IoMdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 text-xl" />
          </div>

          {/* Cart Button */}
          <button
            type="button"
            onClick={handleOrderPopup}
            className="relative p-2 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            <FaCartShopping className="text-xl" />
            <span
              className="absolute top-0 right-0 bg-red-500 text-white text-[10px] 
                         font-semibold rounded-full w-4 h-4 flex items-center justify-center"
            >
              0
            </span>
          </button>

          {/* Dark Mode */}
          <DarkMode />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
