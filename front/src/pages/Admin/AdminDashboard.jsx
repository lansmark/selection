// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBox, FaShoppingCart, FaUsers, FaDollarSign, 
  FaChartLine, FaEye, FaEdit, FaTrash, FaPlus,
  FaSearch, FaFilter, FaDownload, FaBell, FaSignOutAlt, FaUserCircle
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// Import all data
import watchesDataWomen from "../../assets/data/watches-data-women.json";
import watchesDataMen from "../../assets/data/watches-data-men.json";
import clothesDataWomen from "../../assets/data/clothes-data-women.json";
import clothesDataMen from "../../assets/data/clothes-data-men.json";
import bagsDataWomen from "../../assets/data/bags-data-women.json";
import bagsDataMen from "../../assets/data/bags-data-men.json";
import perfumesDataWomen from "../../assets/data/perfumes-data-women.json";
import perfumesDataMen from "../../assets/data/perfumes-data-men.json";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Combine all products
  const allProducts = [
    ...watchesDataWomen.watches_data.map(p => ({ ...p, category: "watches", gender: "women" })),
    ...watchesDataMen.watches_data.map(p => ({ ...p, category: "watches", gender: "men" })),
    ...clothesDataWomen.clothes_data.map(p => ({ ...p, category: "clothes", gender: "women" })),
    ...clothesDataMen.clothes_data.map(p => ({ ...p, category: "clothes", gender: "men" })),
    ...bagsDataWomen.bags_data.map(p => ({ ...p, category: "bags", gender: "women" })),
    ...bagsDataMen.bags_data.map(p => ({ ...p, category: "bags", gender: "men" })),
    ...perfumesDataWomen.perfumes_data.map(p => ({ ...p, category: "perfumes", gender: "women" })),
    ...perfumesDataMen.perfumes_data.map(p => ({ ...p, category: "perfumes", gender: "men" })),
  ];

  // Calculate statistics
  const stats = {
    totalProducts: allProducts.length,
    totalValue: allProducts.reduce((sum, p) => sum + (parseInt(p.price.replace(/[^0-9]/g, '')) || 0), 0),
    lowStock: allProducts.filter(p => p.stock < 10).length,
    categories: {
      watches: allProducts.filter(p => p.category === "watches").length,
      clothes: allProducts.filter(p => p.category === "clothes").length,
      bags: allProducts.filter(p => p.category === "bags").length,
      perfumes: allProducts.filter(p => p.category === "perfumes").length,
    },
    genders: {
      women: allProducts.filter(p => p.gender === "women").length,
      men: allProducts.filter(p => p.gender === "men").length,
    }
  };

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filterGender === "all" || product.gender === filterGender;
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesGender && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your e-commerce store
            </p>
          </div>
          
          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
            <FaUserCircle className="text-4xl text-gray-600 dark:text-gray-400" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FaBox />}
            title="Total Products"
            value={stats.totalProducts}
            color="blue"
          />
          <StatCard
            icon={<FaDollarSign />}
            title="Total Inventory Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={<FaShoppingCart />}
            title="Low Stock Items"
            value={stats.lowStock}
            color="red"
            alert={stats.lowStock > 0}
          />
          <StatCard
            icon={<FaChartLine />}
            title="Categories"
            value={Object.keys(stats.categories).length}
            color="purple"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </TabButton>
              <TabButton
                active={activeTab === "products"}
                onClick={() => setActiveTab("products")}
              >
                Products
              </TabButton>
              <TabButton
                active={activeTab === "inventory"}
                onClick={() => setActiveTab("inventory")}
              >
                Inventory
              </TabButton>
              <TabButton
                active={activeTab === "analytics"}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </TabButton>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewTab stats={stats} allProducts={allProducts} />
            )}
            
            {activeTab === "products" && (
              <ProductsTab
                products={filteredProducts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterGender={filterGender}
                setFilterGender={setFilterGender}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
              />
            )}
            
            {activeTab === "inventory" && (
              <InventoryTab products={allProducts} />
            )}
            
            {activeTab === "analytics" && (
              <AnalyticsTab stats={stats} products={allProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color, alert }) => {
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative overflow-hidden">
      {alert && (
        <div className="absolute top-2 right-2">
          <FaBell className="text-red-500 animate-pulse" />
        </div>
      )}
      <div className={`${colors[color]} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
      active
        ? "text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    }`}
  >
    {children}
  </button>
);

// Overview Tab
const OverviewTab = ({ stats, allProducts }) => {
  const lowStockProducts = allProducts.filter(p => p.stock < 10);
  
  return (
    <div className="space-y-6">
      {/* Category Breakdown */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Products by Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.categories).map(([category, count]) => (
            <div key={category} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm capitalize mb-1">{category}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Breakdown */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Products by Gender
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg p-4">
            <p className="text-pink-600 dark:text-pink-400 text-sm mb-1">Women's Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.genders.women}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4">
            <p className="text-blue-600 dark:text-blue-400 text-sm mb-1">Men's Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.genders.men}</p>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
            <FaBell className="animate-pulse" />
            Low Stock Alert ({lowStockProducts.length} items)
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex justify-between items-center bg-white dark:bg-gray-800 rounded p-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.code}</p>
                </div>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Products Tab
const ProductsTab = ({ products, searchQuery, setSearchQuery, filterGender, setFilterGender, filterCategory, setFilterCategory }) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Genders</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
        </select>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Categories</option>
          <option value="watches">Watches</option>
          <option value="clothes">Clothes</option>
          <option value="bags">Bags</option>
          <option value="perfumes">Perfumes</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Product</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Gender</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.imageFront} alt={product.name} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-mono text-sm">{product.code}</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm capitalize">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                    product.gender === "women" 
                      ? "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                  }`}>
                    {product.gender}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-semibold">{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold ${product.stock < 10 ? "text-red-600" : "text-green-600"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded">
                      <FaEye />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded">
                      <FaEdit />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="text-center text-gray-600 dark:text-gray-400">
        Showing {products.length} products
      </p>
    </div>
  );
};

// Inventory Tab
const InventoryTab = ({ products }) => {
  const inventoryByBrand = {};
  products.forEach(p => {
    if (!inventoryByBrand[p.brand]) {
      inventoryByBrand[p.brand] = { count: 0, totalStock: 0, totalValue: 0 };
    }
    inventoryByBrand[p.brand].count++;
    inventoryByBrand[p.brand].totalStock += p.stock;
    inventoryByBrand[p.brand].totalValue += (parseInt(p.price.replace(/[^0-9]/g, '')) || 0) * p.stock;
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Inventory by Brand</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(inventoryByBrand).map(([brand, data]) => (
          <div key={brand} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 dark:text-white capitalize mb-2">{brand}</h4>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600 dark:text-gray-400">Products: <span className="font-semibold text-gray-900 dark:text-white">{data.count}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Total Stock: <span className="font-semibold text-gray-900 dark:text-white">{data.totalStock}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Total Value: <span className="font-semibold text-gray-900 dark:text-white">${data.totalValue.toLocaleString()}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Analytics Tab
const AnalyticsTab = ({ stats, products }) => {
  const brands = [...new Set(products.map(p => p.brand))];
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Products by Category</h4>
          {Object.entries(stats.categories).map(([category, count]) => (
            <div key={category} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{category}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Top Brands</h4>
          <div className="space-y-3">
            {brands.slice(0, 5).map(brand => {
              const count = products.filter(p => p.brand === brand).length;
              return (
                <div key={brand} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{brand}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;