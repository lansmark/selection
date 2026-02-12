// src/pages/Admin/AdminDashboard.jsx - WITH LOCAL IMAGE UPLOAD
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBox, FaShoppingCart, FaUsers, FaDollarSign, 
  FaChartLine, FaEye, FaEdit, FaTrash, FaPlus,
  FaSearch, FaFilter, FaDownload, FaBell, FaSignOutAlt, FaUserCircle,
  FaCheckCircle, FaWhatsapp, FaTelegram, FaEnvelope, FaTimes, FaUpload, FaImage
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [viewModalProduct, setViewModalProduct] = useState(null);
  const [editModalProduct, setEditModalProduct] = useState(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products?limit=1000');
      const data = await response.json();
      
      if (data.success) {
        const productsWithGender = data.products.map(p => {
          let gender = p.gender;
          if (!gender && p.code) {
            if (p.code.endsWith('-M')) gender = 'men';
            else if (p.code.endsWith('-W')) gender = 'women';
            else gender = 'unisex';
          }
          
          return {
            ...p,
            gender: gender || 'unisex',
            imageFront: p.image_front,
            imageBack: p.image_back,
            price: p.price?.toString().startsWith('$') ? p.price : `$${p.price}`
          };
        });
        
        setAllProducts(productsWithGender);
        console.log(`✅ Loaded ${productsWithGender.length} products from database`);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      alert('Failed to load products from database. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalProducts: allProducts.length,
    totalValue: allProducts.reduce((sum, p) => {
      const price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : p.price;
      return sum + (price || 0);
    }, 0),
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

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filterGender === "all" || product.gender === filterGender;
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesGender && matchesCategory;
  });

  // ✅ VIEW PRODUCT
  const handleViewProduct = (product) => {
    setViewModalProduct(product);
  };

  // ✅ EDIT PRODUCT
  const handleEditProduct = (product) => {
    setEditModalProduct({...product});
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${editModalProduct.category}/${editModalProduct.code}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editModalProduct.name,
            brand: editModalProduct.brand,
            price: parseFloat(editModalProduct.price.replace(/[^0-9.]/g, '')),
            stock: parseInt(editModalProduct.stock),
            description: editModalProduct.description,
            gender: editModalProduct.gender
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Product updated successfully!');
        setEditModalProduct(null);
        await fetchAllProducts();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert('❌ Failed to update product!');
    }
  };

  // ✅ DELETE PRODUCT
  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm(
      `⚠️ DELETE PRODUCT?\n\n` +
      `Name: ${product.name}\n` +
      `Code: ${product.code}\n` +
      `Category: ${product.category}\n\n` +
      `This action CANNOT be undone!`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${product.category}/${product.code}`,
        { method: 'DELETE' }
      );

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Product deleted successfully!');
        await fetchAllProducts();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete product!');
    }
  };

  // ✅ RESTOCK PRODUCT
  const handleRestockProduct = async (product) => {
    const newStock = prompt(
      `Restock: ${product.name}\n\n` +
      `Product Code: ${product.code}\n` +
      `Current Stock: ${product.stock}\n\n` +
      `Enter new stock quantity:`,
      parseInt(product.stock) + 10
    );

    if (!newStock || isNaN(newStock) || newStock < 0) {
      alert('❌ Invalid stock quantity');
      return;
    }

    const confirmRestock = window.confirm(
      `🔔 Restock ${product.name}?\n\n` +
      `Product Code: ${product.code}\n` +
      `Category: ${product.category}\n` +
      `New Stock: ${newStock}\n\n` +
      `This will notify ALL customers waiting for this product!`
    );

    if (!confirmRestock) return;

    try {
      console.log(`📦 Restocking ${product.name} (code: ${product.code}) to ${newStock}...`);
      
      const response = await fetch(
        `http://localhost:5000/api/products/${product.category}/${product.code}/restock`,
        {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ stock: parseInt(newStock) })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not OK:', response.status, errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Auto-open WhatsApp links
        if (data.whatsappLinks && data.whatsappLinks.length > 0) {
          console.log(`📱 Opening ${data.whatsappLinks.length} WhatsApp windows...`);
          
          data.whatsappLinks.forEach((item, index) => {
            setTimeout(() => {
              console.log(`📱 Opening WhatsApp for: ${item.customer}`);
              window.open(item.link, '_blank', 'noopener,noreferrer');
            }, index * 1000);
          });
        }

        alert(
          `✅ SUCCESS!\n\n` +
          `Product: ${data.product.name}\n` +
          `Code: ${data.product.code}\n` +
          `New Stock: ${data.product.stock}\n\n` +
          `📧 ${data.notifications.success} customers notified!\n` +
          `📱 ${data.whatsappLinks?.length || 0} WhatsApp windows opened`
        );
        
        await fetchAllProducts();
      } else {
        alert(`❌ Error: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Restock error:', error);
      alert(`❌ Failed to restock product!\n\n${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your e-commerce store
            </p>
          </div>
          
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaBox />} title="Total Products" value={stats.totalProducts} color="blue" />
          <StatCard icon={<FaDollarSign />} title="Total Inventory Value" value={`$${stats.totalValue.toLocaleString()}`} color="green" />
          <StatCard icon={<FaShoppingCart />} title="Low Stock Items" value={stats.lowStock} color="red" alert={stats.lowStock > 0} />
          <StatCard icon={<FaChartLine />} title="Categories" value={Object.keys(stats.categories).length} color="purple" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto">
              <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Overview</TabButton>
              <TabButton active={activeTab === "products"} onClick={() => setActiveTab("products")}>Products</TabButton>
              <TabButton active={activeTab === "add-product"} onClick={() => setActiveTab("add-product")}>
                <span className="flex items-center gap-2"><FaPlus />Add Product</span>
              </TabButton>
              <TabButton active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")}>Inventory</TabButton>
              <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")}>
                <span className="flex items-center gap-2"><FaBell />Notifications</span>
              </TabButton>
              <TabButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>Analytics</TabButton>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && <OverviewTab stats={stats} allProducts={allProducts} />}
            {activeTab === "products" && (
              <ProductsTab
                products={filteredProducts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterGender={filterGender}
                setFilterGender={setFilterGender}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                handleViewProduct={handleViewProduct}
                handleEditProduct={handleEditProduct}
                handleDeleteProduct={handleDeleteProduct}
                handleRestockProduct={handleRestockProduct}
              />
            )}
            {activeTab === "add-product" && <AddProductTab onProductAdded={fetchAllProducts} />}
            {activeTab === "inventory" && <InventoryTab products={allProducts} />}
            {activeTab === "notifications" && <StockNotificationsTab />}
            {activeTab === "analytics" && <AnalyticsTab stats={stats} products={allProducts} />}
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewModalProduct && (
        <ViewProductModal 
          product={viewModalProduct} 
          onClose={() => setViewModalProduct(null)} 
        />
      )}

      {/* EDIT MODAL */}
      {editModalProduct && (
        <EditProductModal 
          product={editModalProduct}
          setProduct={setEditModalProduct}
          onSave={handleSaveEdit}
          onClose={() => setEditModalProduct(null)}
        />
      )}
    </div>
  );
};

// ✅ ADD PRODUCT TAB WITH LOCAL FILE UPLOAD
const AddProductTab = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    brand: '',
    gender: 'men',
    category: 'watches',
    price: '',
    stock: '',
    description: '',
    image_front: '',
    image_back: ''
  });

  const [uploading, setUploading] = useState(false);
  const [frontImageFile, setFrontImageFile] = useState(null);
  const [backImageFile, setBackImageFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');

  // Handle file selection and preview
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('❌ Please select an image file!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Image size should be less than 5MB!');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'front') {
        setFrontImageFile(file);
        setFrontPreview(reader.result);
      } else {
        setBackImageFile(file);
        setBackPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = (type) => {
    if (type === 'front') {
      setFrontImageFile(null);
      setFrontPreview('');
      setFormData(prev => ({ ...prev, image_front: '' }));
    } else {
      setBackImageFile(null);
      setBackPreview('');
      setFormData(prev => ({ ...prev, image_back: '' }));
    }
  };

  // Upload image to server
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.name || !formData.brand || !formData.price) {
      alert('❌ Please fill in all required fields!');
      return;
    }

    if (!frontImageFile) {
      alert('❌ Please select at least a front image!');
      return;
    }

    try {
      setUploading(true);
      
      // Upload images
      console.log('📤 Uploading images...');
      const frontImageUrl = await uploadImage(frontImageFile);
      let backImageUrl = '';
      
      if (backImageFile) {
        backImageUrl = await uploadImage(backImageFile);
      }

      console.log('✅ Images uploaded successfully');
      console.log('Front:', frontImageUrl);
      console.log('Back:', backImageUrl);

      // Create product
      const response = await fetch(`http://localhost:5000/api/products/${formData.category}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          brand: formData.brand,
          gender: formData.gender,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          description: formData.description,
          image_front: frontImageUrl,
          image_back: backImageUrl
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Product added successfully!');
        
        // Reset form
        setFormData({
          code: '',
          name: '',
          brand: '',
          gender: 'men',
          category: 'watches',
          price: '',
          stock: '',
          description: '',
          image_front: '',
          image_back: ''
        });
        setFrontImageFile(null);
        setBackImageFile(null);
        setFrontPreview('');
        setBackPreview('');
        
        // Refresh products list
        onProductAdded();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Add product error:', error);
      alert('❌ Failed to add product! ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Product</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Code & Category */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Code * <span className="text-xs text-gray-500">(e.g., CK-WATCH-001-M)</span>
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="CK-WATCH-001-M"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="watches">Watches</option>
              <option value="clothes">Clothes</option>
              <option value="bags">Bags</option>
              <option value="perfumes">Perfumes</option>
            </select>
          </div>
        </div>

        {/* Product Name & Brand */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Calvin Klein Classic Watch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand *</label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Calvin Klein"
            />
          </div>
        </div>

        {/* Price, Stock & Gender */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ($) *</label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="99.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock Quantity</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender *</label>
            <select
              required
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter product description..."
          />
        </div>

        {/* Image Upload - Front & Back */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Front Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Front Image * <span className="text-xs text-gray-500">(Max 5MB)</span>
            </label>
            
            {frontPreview ? (
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2">
                <img 
                  src={frontPreview} 
                  alt="Front preview" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage('front')}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <FaTimes />
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">{frontImageFile?.name}</p>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="text-4xl text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                />
              </label>
            )}
          </div>

          {/* Back Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Back Image (Optional) <span className="text-xs text-gray-500">(Max 5MB)</span>
            </label>
            
            {backPreview ? (
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2">
                <img 
                  src={backPreview} 
                  alt="Back preview" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage('back')}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <FaTimes />
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">{backImageFile?.name}</p>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaImage className="text-4xl text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'back')}
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset the form?')) {
                setFormData({
                  code: '', name: '', brand: '', gender: 'men', category: 'watches',
                  price: '', stock: '', description: '', image_front: '', image_back: ''
                });
                setFrontImageFile(null);
                setBackImageFile(null);
                setFrontPreview('');
                setBackPreview('');
              }
            }}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
            disabled={uploading}
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaPlus /> Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ✅ VIEW PRODUCT MODAL
const ViewProductModal = ({ product, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img 
              src={product.imageFront || product.image_front || "/assets/placeholder/placeholder-1.png"}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
              onError={(e) => { e.target.src = "/assets/placeholder/placeholder-1.png"; }}
            />
            {product.imageBack && (
              <img 
                src={product.imageBack}
                alt={`${product.name} back`}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Product Name</label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Brand</label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.brand}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Code</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.code}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Category</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{product.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Price</label>
                <p className="text-2xl font-bold text-green-600">{product.price}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Stock</label>
                <p className={`text-2xl font-bold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>{product.stock}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Gender</label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{product.gender}</p>
            </div>

            {product.description && (
              <div>
                <label className="text-sm text-gray-500">Description</label>
                <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ✅ EDIT PRODUCT MODAL
const EditProductModal = ({ product, setProduct, onSave, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({...product, name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
            <input
              type="text"
              value={product.brand}
              onChange={(e) => setProduct({...product, brand: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
              <input
                type="text"
                value={product.price}
                onChange={(e) => setProduct({...product, price: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
              <input
                type="number"
                value={product.stock}
                onChange={(e) => setProduct({...product, stock: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
            <select
              value={product.gender}
              onChange={(e) => setProduct({...product, gender: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={product.description || ''}
              onChange={(e) => setProduct({...product, description: e.target.value})}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
);

// STOCK NOTIFICATIONS TAB
const StockNotificationsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/notify-me?status=${filter === 'all' ? '' : filter}&limit=100`);
      const data = await response.json();
      if (data.success) setRequests(data.requests);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm('Delete this request?')) {
      await fetch(`http://localhost:5000/api/notify-me/${id}`, { method: 'DELETE' });
      fetchRequests();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Notification Requests</h3>
      
      <div className="flex gap-4">
        {['pending', 'notified', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === f
                ? f === 'pending' ? 'bg-yellow-500 text-black' : f === 'notified' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-12 text-center">
          <FaBell className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Requests Found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{req.product_name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div><span className="text-gray-500">Code:</span> <p className="font-semibold text-gray-900 dark:text-white">{req.product_code}</p></div>
                    <div><span className="text-gray-500">Price:</span> <p className="font-semibold text-yellow-600">{req.product_price}</p></div>
                    <div><span className="text-gray-500">Brand:</span> <p className="font-semibold text-gray-900 dark:text-white">{req.product_brand}</p></div>
                    <div><span className="text-gray-500">Category:</span> <p className="font-semibold text-gray-900 dark:text-white">{req.product_category}</p></div>
                  </div>
                  <div className="border-t pt-4">
                    <h5 className="font-semibold mb-2">Customer:</h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><span className="text-gray-500">Name:</span> <p className="font-semibold">{req.customer_name}</p></div>
                      <div><span className="text-gray-500">Email:</span> <p className="font-semibold">{req.customer_email}</p></div>
                      <div><span className="text-gray-500">Phone:</span> <p className="font-semibold">{req.customer_phone || 'N/A'}</p></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Requested: {new Date(req.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {req.status === 'pending' ? (
                    <div className="px-6 py-3 bg-yellow-100 text-yellow-800 font-semibold rounded-lg">Pending</div>
                  ) : (
                    <div className="px-6 py-3 bg-green-100 text-green-800 font-semibold rounded-lg flex items-center gap-2">
                      <FaCheckCircle /> Notified
                    </div>
                  )}
                  <button onClick={() => deleteRequest(req.id)} className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, color, alert }) => {
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative">
      {alert && <FaBell className="absolute top-2 right-2 text-red-500 animate-pulse" />}
      <div className={`${colors[color]} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>{icon}</div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
};

const TabButton = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-6 py-4 font-semibold whitespace-nowrap ${active ? "text-red-600 border-b-2 border-red-600" : "text-gray-600 hover:text-gray-900"}`}>
    {children}
  </button>
);

const OverviewTab = ({ stats, allProducts }) => {
  const lowStock = allProducts.filter(p => p.stock < 10);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Products by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.categories).map(([cat, count]) => (
            <div key={cat} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-600 text-sm capitalize">{cat}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>
      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
            <FaBell className="animate-pulse" /> Low Stock Alert ({lowStock.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {lowStock.map(p => (
              <div key={p.id} className="flex justify-between bg-white rounded p-3">
                <div><p className="font-semibold">{p.name}</p><p className="text-sm text-gray-600">{p.code}</p></div>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductsTab = ({ 
  products, searchQuery, setSearchQuery, filterGender, setFilterGender, 
  filterCategory, setFilterCategory, handleViewProduct, handleEditProduct, 
  handleDeleteProduct, handleRestockProduct 
}) => (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      </div>
      <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <option value="all">All Genders</option><option value="women">Women</option><option value="men">Men</option>
      </select>
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <option value="all">All Categories</option><option value="watches">Watches</option><option value="clothes">Clothes</option><option value="bags">Bags</option><option value="perfumes">Perfumes</option>
      </select>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Product</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Code</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Stock</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((p) => (
            <tr key={`${p.category}-${p.id}-${p.code}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={p.imageFront || p.image_front || "/assets/placeholder/placeholder-1.png"} 
                    alt={p.name} 
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => { e.target.src = "/assets/placeholder/placeholder-1.png"; }}
                  />
                  <div><p className="font-semibold text-gray-900 dark:text-white">{p.name}</p><p className="text-sm text-gray-600 dark:text-gray-400">{p.brand}</p></div>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-sm text-gray-900 dark:text-white">{p.code}</td>
              <td className="px-4 py-3"><span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{p.category}</span></td>
              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{p.price}</td>
              <td className="px-4 py-3"><span className={`font-bold ${p.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>{p.stock}</span></td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => handleViewProduct(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="View"><FaEye /></button>
                  <button onClick={() => handleEditProduct(p)} className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors" title="Edit"><FaEdit /></button>
                  <button onClick={() => handleRestockProduct(p)} className="p-2 text-purple-600 hover:bg-purple-100 rounded transition-colors" title="Restock"><FaBell className="animate-pulse" /></button>
                  <button onClick={() => handleDeleteProduct(p)} className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors" title="Delete"><FaTrash /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-center text-gray-600 dark:text-gray-400">Showing {products.length} products</p>
  </div>
);

const InventoryTab = ({ products }) => {
  const byBrand = {};
  products.forEach(p => {
    if (!byBrand[p.brand]) byBrand[p.brand] = { count: 0, stock: 0, value: 0 };
    byBrand[p.brand].count++;
    byBrand[p.brand].stock += p.stock;
    const price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : p.price;
    byBrand[p.brand].value += (price || 0) * p.stock;
  });
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Inventory by Brand</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(byBrand).map(([brand, data]) => (
          <div key={brand} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold capitalize mb-2 text-gray-900 dark:text-white">{brand}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Products: <span className="font-semibold text-gray-900 dark:text-white">{data.count}</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Stock: <span className="font-semibold text-gray-900 dark:text-white">{data.stock}</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Value: <span className="font-semibold text-gray-900 dark:text-white">${data.value.toLocaleString()}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsTab = ({ stats, products }) => {
  const brands = [...new Set(products.map(p => p.brand))];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Analytics</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Products by Category</h4>
          {Object.entries(stats.categories).map(([cat, count]) => (
            <div key={cat} className="mb-3">
              <div className="flex justify-between mb-1 text-gray-900 dark:text-white"><span className="capitalize">{cat}</span><span className="font-semibold">{count}</span></div>
              <div className="w-full bg-gray-300 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${(count / stats.totalProducts) * 100}%` }}></div></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Top Brands</h4>
          {brands.slice(0, 5).map(brand => {
            const count = products.filter(p => p.brand === brand).length;
            return <div key={brand} className="flex justify-between mb-3 text-gray-900 dark:text-white"><span className="capitalize">{brand}</span><span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">{count}</span></div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;