import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLocationArrow,
  FaMobileAlt,
  FaWhatsapp,
} from "react-icons/fa";

const footerLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Contact", link: "/contact" },
  { title: "Blog", link: "/blog" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300 transition-colors duration-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Company details */}
          <div>
            <Link
              to="/"
              className="text-red-700 font-semibold tracking-widest text-2xl uppercase sm:text-2xl"
            >
              Selection
            </Link>

            <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus similique officiis laudantium vel eum nemo.
            </p>

            <p className="text-gray-500 mt-4">
              Made with 💖{" "}
              <a
                href="https://www.facebook.com/ahmed.elkhateeb.7127e"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Selection Brand
              </a>
            </p>

            <a
              href="https://whatsapp.com/channel/your-channel-id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-700 hover:bg-red-800 text-white py-2 px-5 mt-5 text-sm rounded-full transition-colors duration-300"
            >
              Visit our WhatsApp Channel
            </a>
          </div>

          {/* Footer links */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Important Links */}
            <div>
              <h2 className="text-lg font-bold mb-4">Important Links</h2>
              <ul className="space-y-3">
                {footerLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="hover:text-black dark:hover:text-white transition-colors duration-300"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-lg font-bold mb-4">Quick Links</h2>
              <ul className="space-y-3">
                {footerLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="hover:text-black dark:hover:text-white transition-colors duration-300"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Address Section */}
            <div>
              <h2 className="text-lg font-bold mb-4">Address</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <FaLocationArrow />
                  <p>Madinet Nasr, Cairo</p>
                </div>

                <div className="flex items-center gap-3">
                  <FaMobileAlt />
                  <p>02 01005532183</p>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4 mt-4">
                  <a href="#" aria-label="Instagram">
                    <FaInstagram className="text-3xl hover:text-red-600 transition-colors duration-300" />
                  </a>
                  <a href="#" aria-label="Facebook">
                    <FaFacebook className="text-3xl hover:text-blue-600 transition-colors duration-300" />
                  </a>
                  <a href="#" aria-label="WhatsApp">
                    <FaWhatsapp className="text-3xl hover:text-green-600 transition-colors duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + Bottom note */}
        <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Selection. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
