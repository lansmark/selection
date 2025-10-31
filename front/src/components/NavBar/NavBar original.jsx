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
      className="fixed top-0 left-0 w-full z-50 bg-transparent 
                 text-white backdrop-blur-sm transition-all duration-300"
    >
      <div className="py-4">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
          {/* 🟥 Left Section — Logo + Menu */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link
              to="/"
              className="text-red-500 font-bold tracking-widest text-2xl uppercase sm:text-3xl"
            >
              Selection
            </Link>

            {/* Menu Items */}
            <div className="hidden lg:block">
              <ul className="flex items-center space-x-6 text-lg font-medium">
                {MenuLinks.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      className="inline-block px-2 py-2 font-semibold text-gray-200 hover:text-white duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}

                {/* 🔽 Dropdown Menu */}
                <li className="relative cursor-pointer group">
                  <div className="flex items-center gap-[2px] font-semibold text-gray-200 hover:text-white py-2">
                    <Link to="/">Quick Links</Link>
                    <FaCaretDown className="group-hover:rotate-180 duration-300" />
                  </div>

                  <div className="absolute hidden group-hover:block w-[200px] rounded-md bg-white dark:bg-gray-900 shadow-md p-2.5">
                    <ul className="space-y-2">
                      {DropdownLinks.map((data) => (
                        <li key={data.id}>
                          <Link
                            to={data.link}
                            className="text-gray-700 dark:text-gray-300 hover:bg-red-500/20 hover:text-red-600 dark:hover:text-white inline-block w-full p-2 rounded-md font-semibold duration-200"
                          >
                            {data.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* 🟩 Right Section — Search + Cart + Dark Mode */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Search here..."
                className="search-bar text-black dark:text-white bg-white/20 dark:bg-gray-800/40 rounded-md pl-3 pr-10 py-2 focus:outline-none placeholder-gray-300"
              />
              <IoMdSearch
                className="text-xl text-gray-200 absolute top-1/2 -translate-y-1/2 right-3 group-hover:text-red-500 duration-200"
              />
            </div>

            {/* Cart Button */}
            <button
              type="button"
              className="relative p-3"
              onClick={handleOrderPopup}
            >
              <FaCartShopping className="text-xl text-gray-200 hover:text-red-500 duration-200" />
              <div className="w-4 h-4 bg-red-500 text-white rounded-full text-xs absolute top-0 right-0 flex items-center justify-center">
                0
              </div>
            </button>

            {/* Dark Mode Toggle */}
            <DarkMode />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
