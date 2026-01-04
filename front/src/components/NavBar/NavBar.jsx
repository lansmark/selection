import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdSearch, IoMdClose, IoMdMenu } from "react-icons/io";
import { FaCaretDown, FaCartShopping } from "react-icons/fa6";
import DarkMode from "./DarkMode";
import AnimatedLogo from "./AnimatedLogo";

// Navigation links
const MenuLinks = [
  { id: 1, name: "Home", link: "/" },
];

const ContactLink = { id: 2, name: "Contact", link: "/contact" };

const WomenLinks = {
  watches: [
    { id: 1, name: "Emporio Armani", link: "/women/watches/emporio-armani" },
    { id: 2, name: "Armani Exchange", link: "/women/watches/armani-exchange" },
    { id: 3, name: "Guess", link: "/women/watches/guess" },
    { id: 4, name: "Boss", link: "/women/watches/boss" },
    { id: 5, name: "MK", link: "/women/watches/mk" },
    { id: 6, name: "Cavalli", link: "/women/watches/cavalli" },
    
  ],
  clothes: [
    { id: 1, name: "Dolce & Gabbana", link: "/women/clothes/dolce-gabbana" },
    { id: 2, name: "Michael Kors", link: "/women/clothes/mk" },
    { id: 3, name: "Valentino", link: "/women/clothes/valentino" },
    { id: 4, name: "Armani", link: "/women/clothes/armani" },
  ],
  bags: [
    { id: 1, name: "Armani", link: "/women/bags/armani" },
    { id: 2, name: "Emporio Armani", link: "/women/bags/emporio-armani" },
    { id: 3, name: "Guess", link: "/women/bags/guess" },
    { id: 4, name: "Michael Kors", link: "/women/bags/mk" },
  ],
  perfumes: [
    { id: 1, name: "Dior", link: "/women/perfumes/dior" },
    { id: 2, name: "Chanel", link: "/women/perfumes/chanel" },
    { id: 3, name: "Armani", link: "/women/perfumes/armani" },
    { id: 4, name: "Oud", link: "/women/perfumes/oud" },
  ],
};

const MenLinks = {
  watches: [
    { id: 1, name: "Emporio Armani", link: "/men/watches/emporio-armani" },
    { id: 2, name: "Armani Exchange", link: "/men/watches/armani-exchange" },
    { id: 3, name: "Guess", link: "/men/watches/guess" },
    { id: 4, name: "Boss", link: "/men/watches/boss" },
    { id: 5, name: "MK", link: "/men/watches/mk" },
    { id: 6, name: "Cavalli", link: "/men/watches/cavalli" },
  ],
  clothes: [
    { id: 1, name: "Dolce & Gabbana", link: "/men/clothes/dolce-gabbana" },
    { id: 2, name: "Michael Kors", link: "/men/clothes/mk" },
    { id: 3, name: "Valentino", link: "/men/clothes/valentino" },
    { id: 4, name: "Armani", link: "/men/clothes/armani" },
  ],
  bags: [
    { id: 1, name: "Armani", link: "/men/bags/armani" },
    { id: 2, name: "Emporio Armani", link: "/men/bags/emporio-armani" },
    { id: 3, name: "Guess", link: "/men/bags/guess" },
    { id: 4, name: "Michael Kors", link: "/men/bags/mk" },
  ],
  perfumes: [
    { id: 1, name: "Dior", link: "/men/perfumes/dior" },
    { id: 2, name: "Chanel", link: "/men/perfumes/chanel" },
    { id: 3, name: "Armani", link: "/men/perfumes/armani" },
    { id: 4, name: "Oud", link: "/men/perfumes/oud" },
  ],
};

const NavBar = ({ handleOrderPopup, cartCount }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileWomenOpen, setMobileWomenOpen] = useState(false);
  const [mobileMenOpen, setMobileMenOpen] = useState(false);

  const isActive = (link) => currentPath === link;
  const isDropdownActive = (prefix) => currentPath.startsWith(prefix);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileWomenOpen(false);
    setMobileMenOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileWomenOpen(false);
    setMobileMenOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-white shadow-sm transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6">

        {/* ===== Left — Mobile Menu Button + Desktop Menu ===== */}
        <div className="flex items-center gap-6">
          {/* Mobile Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 hover:text-red-700 dark:hover:text-red-400 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IoMdClose className="text-2xl" /> : <IoMdMenu className="text-2xl" />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 font-semibold">
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

            <GenderDropdown 
              title="Women" 
              links={WomenLinks} 
              activePrefix="/women" 
              isDropdownActive={isDropdownActive}
              currentPath={currentPath}
            />
            
            <GenderDropdown 
              title="Men" 
              links={MenLinks} 
              activePrefix="/men" 
              isDropdownActive={isDropdownActive}
              currentPath={currentPath}
            />

            <Link
              to={ContactLink.link}
              className={`hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200
                          ${isActive(ContactLink.link) ? "text-red-700 dark:text-red-400 font-bold" : ""}`}
            >
              {ContactLink.name}
            </Link>
          </div>
        </div>

        {/* ===== Center — Logo ===== */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <AnimatedLogo />
        </div>

        {/* ===== Right — Search, Cart, Dark Mode ===== */}
        <div className="flex items-center gap-4">
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

      {/* ===== Mobile Menu ===== */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            
            {/* Home Link */}
            {MenuLinks.map((data) => (
              <Link
                key={data.id}
                to={data.link}
                onClick={closeMobileMenu}
                className={`block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                            ${isActive(data.link) ? "text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20" : ""}`}
              >
                {data.name}
              </Link>
            ))}

            {/* Women's Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              <button
                onClick={() => setMobileWomenOpen(!mobileWomenOpen)}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                            ${isDropdownActive('/women') ? "text-red-700 dark:text-red-400 font-bold" : ""}`}
              >
                <span>Women</span>
                <FaCaretDown className={`transition-transform duration-300 ${mobileWomenOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileWomenOpen && (
                <div className="pl-4 space-y-1">
                  <MobileCategorySection title="Watches" links={WomenLinks.watches} onLinkClick={closeMobileMenu} currentPath={currentPath} />
                  <MobileCategorySection title="Clothes" links={WomenLinks.clothes} onLinkClick={closeMobileMenu} currentPath={currentPath} />
                  <MobileCategorySection title="Bags" links={WomenLinks.bags} onLinkClick={closeMobileMenu} currentPath={currentPath} />
                  <MobileCategorySection title="Perfumes" links={WomenLinks.perfumes} onLinkClick={closeMobileMenu} currentPath={currentPath} />
                </div>
              )}
            </div>

            {/* Men's Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              <button
                onClick={() => setMobileMenOpen(!mobileMenOpen)}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                            ${isDropdownActive('/men') ? "text-red-700 dark:text-red-400 font-bold" : ""}`}
              >
                <span>Men</span>
                <FaCaretDown className={`transition-transform duration-300 ${mobileMenOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileMenOpen && (
                <div className="pl-4 space-y-1">
                  <MobileCategorySection title="Watches" links={MenLinks.watches} onLinkClick={closeMobileMenu} currentPath={currentPath} />
                  <MobileCategorySection title="Clothes" links={MenLinks.clothes} onLinkClick={closeMobileMenu} currentPath={currentPath} />
                  <MobileCategorySection title="Bags" links={MenLinks.bags} onLinkClick={closeMobileMenu} currentPath={currentPath} />
                  <MobileCategorySection title="Perfumes" links={MenLinks.perfumes} onLinkClick={closeMobileMenu} currentPath={currentPath} />
                </div>
              )}
            </div>

            {/* Contact Link */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              <Link
                to={ContactLink.link}
                onClick={closeMobileMenu}
                className={`block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                            ${isActive(ContactLink.link) ? "text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20" : ""}`}
              >
                {ContactLink.name}
              </Link>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

/* ===== Desktop Gender Dropdown Component ===== */
const GenderDropdown = ({ title, links, activePrefix, isDropdownActive, currentPath }) => (
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

    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transform transition-all duration-300 ease-out z-50">
      <div className="py-2">
        {/* Watches */}
        <div className="px-4 py-2">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Watches</h4>
          {links.watches.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`block px-2 py-1 text-sm rounded
                          ${currentPath === item.link ? "text-red-700 dark:text-red-400 font-bold" : "text-gray-700 dark:text-gray-300"} 
                          hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 transition-colors`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

        {/* Clothes */}
        <div className="px-4 py-2">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Clothes</h4>
          {links.clothes.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`block px-2 py-1 text-sm rounded
                          ${currentPath === item.link ? "text-red-700 dark:text-red-400 font-bold" : "text-gray-700 dark:text-gray-300"} 
                          hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 transition-colors`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

        {/* Bags */}
        <div className="px-4 py-2">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Bags</h4>
          {links.bags.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`block px-2 py-1 text-sm rounded
                          ${currentPath === item.link ? "text-red-700 dark:text-red-400 font-bold" : "text-gray-700 dark:text-gray-300"} 
                          hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 transition-colors`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

        {/* Perfumes */}
        <div className="px-4 py-2">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Perfumes</h4>
          {links.perfumes.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`block px-2 py-1 text-sm rounded
                          ${currentPath === item.link ? "text-red-700 dark:text-red-400 font-bold" : "text-gray-700 dark:text-gray-300"} 
                          hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 transition-colors`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ===== Mobile Category Section Component ===== */
const MobileCategorySection = ({ title, links, onLinkClick, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        {title}
        <FaCaretDown className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="pl-4 space-y-1">
          {links.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={onLinkClick}
              className={`block py-2 px-4 text-sm rounded-lg transition-colors
                          ${currentPath === item.link 
                            ? "text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20" 
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};