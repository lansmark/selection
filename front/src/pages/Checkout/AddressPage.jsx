import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaShippingFast, FaHeadset, FaLock } from "react-icons/fa";

const AddressPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    country: "",
    city: "",
    street: "",
  });

  // List of countries
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi",
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway",
    "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
    "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
    "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
    "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  // Egyptian cities with shipping fees
  const egyptianCities = {
    "Cairo": 65,
    "Giza": 65,
    "Alexandria": 80,
    "Alexandria's districts": 130,
    "Sharqia": 85,
    "Dakahlia": 85,
    "Ismailia": 85,
    "Beheira": 85,
    "Suez": 85,
    "Port Said": 85,
    "Damietta": 85,
    "Gharbia": 85,
    "Faiyum": 95,
    "Qalyubia": 85,
    "Kafr El Sheikh": 85,
    "Monufia": 85,
    "Aswan": 120,
    "Luxor": 120,
    "Qena": 95,
    "Sohag": 95,
    "Beni Suef": 95,
    "Assiut": 95,
    "Minya": 95,
    "New Cairo": 70,
    "Maadi": 70,
    "El Rehaab": 70,
    "Six October": 70,
    "Madenty": 70,
    "Matruh": 130,
    "New Valley": 130,
    "South Sinai": 130,
    "Red Sea": 130,
  };

  const handleNext = () => {
    if (!address.fullName || !address.phone || !address.country || !address.city || !address.street) {
      alert("Please fill out all fields");
      return;
    }
    
    navigate("/checkout/payment", { 
      state: { 
        address,
        cart,
        subtotal,
        shippingFee,
        total
      } 
    });
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  // Calculate shipping fee based on country and city
  const calculateShipping = () => {
    if (!address.country) return 0;
    
    if (address.country === "Egypt") {
      if (address.city && egyptianCities[address.city]) {
        return egyptianCities[address.city];
      }
      return 85;
    } else {
      return 1500;
    }
  };

  const shippingFee = calculateShipping();
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen section">
      {/* Elegant Progress Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="app-container -mt-10 py-4">
          <div className="flex items-center gap-3 text-sm">
            <Link to="/cart" className="text-gray-700 dark:text-gray-300 hover:text-brand-yellow dark:hover:text-brand-yellow transition-all duration-300 font-medium">
              Cart
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="font-bold text-brand-yellow">Address</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-gray-400 font-medium">Payment</span>
          </div>
        </div>
      </div>

      <div className="app-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selection Support Card */}
            <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 dark:bg-blue-500 p-4 rounded-full">
                  <FaHeadset className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Selection Support
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Need help with your order? Our team is here to assist you 24/7
                  </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                  Get Help
                </button>
              </div>
            </div>

            {/* Shipping Address Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <FaShippingFast className="text-2xl text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Shipping Address
                </h2>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter your full name"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel"
                    placeholder="Enter your phone number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={address.country}
                    onChange={(e) => {
                      setAddress({ ...address, country: e.target.value, city: "" });
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  {address.country === "Egypt" ? (
                    <select
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select your city</option>
                      {Object.keys(egyptianCities).sort().map((city) => (
                        <option key={city} value={city}>
                          {city} (Shipping: EGP {egyptianCities[city]})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text"
                      placeholder="Enter your city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter your street address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                  />
                </div>

                {/* Shipping Info Display */}
                {address.country && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <FaShippingFast className="text-xl" />
                      <div>
                        <p className="font-semibold">Shipping to: {address.country}</p>
                        {address.country === "Egypt" && address.city && (
                          <p className="text-sm">{address.city} - EGP {egyptianCities[address.city] || 85}</p>
                        )}
                        {address.country !== "Egypt" && (
                          <p className="text-sm">International Shipping - EGP 1500</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FaLock />
                  Continue to Payment
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold py-4 rounded-xl transition-all duration-300"
                >
                  ← Back to Cart
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Order Summary (1 column) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 animate-selectBrandFade">
              {/* Summary Card */}
              <div className="bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FaLock className="text-brand-yellow" />
                  Order Summary
                </h2>

                {/* Cart Items Preview */}
                <div className="mb-4 space-y-3 max-h-56 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                      <img
                        src={item.imageFront || item.images?.[0]}
                        alt={item.name || item.title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-500 dark:text-white truncate">
                          {item.name || item.title}
                        </h4>
                         <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                          Code: {item.code || 1}
                        </p>
                        
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity || 1}
                        </p>
                        {/*<p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">
                          {item.price}
                        </p>*/}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {/* Subtotal */}
                  <div className="bg-brand-yellow hover:bg-yellow-500 text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:animate-selectBrandLift shadow-lg hover:shadow-2xl text-lg px-3">
                    <div className="flex justify-between">
                      <span className="text-yellow-800 dark:text-yellow-200 font-semibold">Subtotal</span>
                      <span className="text-yellow-800 dark:text-yellow-200 font-bold">EGP {subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="bg-brand-yellow hover:bg-yellow-500 text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:animate-selectBrandLift shadow-lg hover:shadow-2xl text-lg px-3">
                    <div className="flex justify-between">
                      <span className="text-yellow-800 dark:text-yellow-200 font-semibold">Shipping</span>
                      <span className="text-yellow-800 dark:text-yellow-200 font-bold">
                        {shippingFee === 0 ? 'FREE' : `EGP ${shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-brand-yellow hover:bg-yellow-500 text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:animate-selectBrandLift shadow-lg hover:shadow-2xl text-lg px-3">
                    <div className="flex justify-between">
                      <span className="text-yellow-800 dark:text-yellow-200 font-bold text-lg">Total</span>
                      <span className="text-yellow-800 dark:text-yellow-200 font-bold text-xl">EGP {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Secure Checkout Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <FaLock />
                  <span>Secure Checkout • SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;