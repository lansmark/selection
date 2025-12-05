import React from "react";
import { Link } from "react-router-dom";

const AnimatedLogo = () => {
  const logoText = "Selection";

  return (
    <div className="flex justify-center items-center">
      <Link
        to="/"
        className="text-red-700 dark:text-red-400 text-2xl sm:text-3xl font-bold tracking-widest uppercase"
      >
        {logoText.split("").map((letter, index) => (
          <span
            key={index}
            className="animated-letter"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </Link>
    </div>
  );
};

export default AnimatedLogo;
