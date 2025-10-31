import React from 'react';

// Paste your SVG code here or import them as React components from files.
// For example:
// import { ReactComponent as SunIcon } from '../../assets/icons/SunIcon.svg';
// import { ReactComponent as MoonIcon } from '../../assets/icons/MoonIcon.svg';

const SunIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-6 w-6" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
    />
  </svg>
);

const MoonIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-6 w-6" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
    />
  </svg>
);

const DarkMode = () => {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );
  const element = document.documentElement;

  React.useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      element.classList.add("dark");
    } else {
      // Remove both 'dark' and 'light' to avoid conflicts
      element.classList.remove("dark");
      element.classList.remove("light");
    }
  }, [theme]); // Add 'theme' to the dependency array

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className=' flex justify-between items-center '>
    <button
      onClick={toggleTheme}
      aria-label={`Toggle to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="flex items-center justify-center p-2 cursor-pointer duration-300"
    >
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
    </div>
  );
};

export default DarkMode;