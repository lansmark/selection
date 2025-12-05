import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaCaretDown, FaCartShopping } from "react-icons/fa6";
import DarkMode from "./DarkMode";
import AnimatedLogo from "./AnimatedLogo";

// Navigation links
const MenuLinks = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Shop", link: "/shop" },
];
const PerfumeLinks = [
  { id: 1, name: "Dior", link: "/perfumes/dior" },
  { id: 2, name: "Chanel", link: "/perfumes/chanel" },
  { id: 3, name: "Armani", link: "/perfumes/armani" },
  { id: 4, name: "Oud", link: "/perfumes/oud" },
];
const WatchLinks = [
  { id: 1, name: "Emporio Armani", link: "/watches/emporio-armani" },
  { id: 2, name: "Armani Exchange", link: "/watches/armani-exchange" },
  { id: 3, name: "Guess", link: "/watches/guess" },
  { id: 4, name: "Boss", link: "/watches/boss" },
  { id: 5, name: "Mk", link: "/watches/mk" },
];
const ClothesLinks = [
  { id: 1, name: "Dolce & Gabbana", link: "/clothes/dolce-gabbana" },
  { id: 2, name: "Michael Kors", link: "/clothes/mk" },
  { id: 3, name: "Valentino", link: "/clothes/valentino" },
  { id: 4, name: "Armani", link: "/clothes/armani" },
];
const BagsLinks = [
  { id: 1, name: "Armani", link: "/bags/armani" },
  { id: 2, name: "Emporio Armani", link: "/bags/emporio-armani" },
  { id: 3, name: "Guess", link: "/bags/guess" },
  { id: 4, name: "Michael Kors", link: "/bags/mk" },
];

const NavBar = ({ handleOrderPopup, cartCount }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (link) => currentPath === link;
  const isDropdownActive = (prefix) => currentPath.startsWith(prefix);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-white shadow-sm transition-all duration-300">
      <div className="container mx-auto grid grid-cols-3 items-center py-4 px-4 sm:px-6">

        {/* ===== Left — Menu Links ===== */}
        <div className="hidden lg:flex items-center gap-6 font-semibold relative justify-start">
          {MenuLinks.map((data) => (
            <Link
              key={data.id}
              to={data.link}
              className={`hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200
                          ${isActive(data.link) ? "text-red-700 dark:text-red-400 font-bold" : ""}`}
            >
              {data.name}
            </Link>
          ))}

          <Dropdown title="Perfumes" links={PerfumeLinks} activePrefix="/perfumes" isDropdownActive={isDropdownActive} />
          <Dropdown title="Watches" links={WatchLinks} activePrefix="/watches" isDropdownActive={isDropdownActive} />
          <Dropdown title="Clothes" links={ClothesLinks} activePrefix="/clothes" isDropdownActive={isDropdownActive} />
          <Dropdown title="Bags" links={BagsLinks} activePrefix="/bags" isDropdownActive={isDropdownActive} />
        </div>

        {/* ===== Center — Logo ===== */}
        <div className="flex justify-center items-center">
          <AnimatedLogo />
        </div>

        {/* ===== Right — Search, Cart, Dark Mode ===== */}
        <div className="flex items-center gap-4 justify-end">
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

          {/* Cart */}
          <button
            type="button"
            onClick={handleOrderPopup}
            className="relative p-2 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200"
          >
            <FaCartShopping className="text-xl transition-transform duration-200 hover:scale-110" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          </button>

          <DarkMode />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

/* ===== Dropdown Component ===== */
const Dropdown = ({ title, links, activePrefix, isDropdownActive }) => (
  <div className="relative group">
    <button
      type="button"
      className={`flex items-center gap-1 font-semibold 
                  ${isDropdownActive(activePrefix) ? "text-red-700 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}
                  hover:text-red-700 dark:hover:text-red-400 transition-colors`}
    >
      {title}
      <FaCaretDown className="transition-transform duration-300 group-hover:rotate-180" />
    </button>

    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transform transition-all duration-300 ease-out z-50">
      <ul className="py-2">
        {links.map((item) => (
          <li key={item.id}>
            <Link
              to={item.link}
              className={`block px-4 py-2 text-sm 
                          ${window.location.pathname === item.link ? "text-red-700 dark:text-red-400 font-bold" : "text-gray-700 dark:text-gray-300"} 
                          hover:bg-red-500/20 hover:text-red-700 dark:hover:text-white transition-colors rounded-md`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
