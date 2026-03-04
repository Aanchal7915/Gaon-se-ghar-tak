

import React, { useState, useEffect } from 'react';

import apiClient from '../services/apiClient';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    gender: '',
    subCategory: '',
    isFeatured: false,
    isBestseller: false,
    videoUrl: '',
    farmerName: '',
    farmerPhone: '',
    farmerLocation: '',
    farmerEmail: '',
    isComingSoon: false,
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newCategoryImagePreview, setNewCategoryImagePreview] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [variants, setVariants] = useState([{ size: '', price: '', originalPrice: '', discount: '', countInStock: '' }]);
  const [pincodePricingRows, setPincodePricingRows] = useState([{ pincodes: '', size: '', originalPrice: '', discount: '', price: '', inventory: '' }]);
  const [pincodeLocationMap, setPincodeLocationMap] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [refreshCategories, refreshProducts]);

  const extractPincodes = (value = '') => value
    .split(',')
    .map((p) => p.trim())
    .filter((p) => /^\d{6}$/.test(p));

  const resolvePincodeLocation = async (pincode) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      const postOffice = data?.[0]?.PostOffice?.[0];
      if (!postOffice) return '';
      return `${postOffice.District}, ${postOffice.State}`;
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    const allPincodes = [...new Set(
      pincodePricingRows.flatMap((row) => extractPincodes(row.pincodes))
    )];

    if (!allPincodes.length) return;

    let isMounted = true;
    const fetchLocations = async () => {
      for (const pincode of allPincodes) {
        if (pincodeLocationMap[pincode]) continue;
        const location = await resolvePincodeLocation(pincode);
        if (!isMounted || !location) continue;
        setPincodeLocationMap((prev) => (prev[pincode] ? prev : { ...prev, [pincode]: location }));
      }
    };

    fetchLocations();
    return () => {
      isMounted = false;
    };
  }, [pincodePricingRows, pincodeLocationMap]);

  useEffect(() => {
    const allPincodes = [...new Set(
      pincodePricingRows.flatMap((row) => extractPincodes(row.pincodes))
    )];
    if (!allPincodes.length) return;

    const uniqueLocations = [...new Set(
      allPincodes
        .map((pincode) => pincodeLocationMap[pincode])
        .filter(Boolean)
    )];

    if (!uniqueLocations.length) return;

    const mergedLocation = uniqueLocations.join(', ');
    setFormData((prev) => (
      prev.farmerLocation === mergedLocation ? prev : { ...prev, farmerLocation: mergedLocation }
    ));
  }, [pincodePricingRows, pincodeLocationMap]);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get('/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? All products in this category might lose their link.')) return;
    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Category deleted successfully!');
      setRefreshCategories(prev => !prev);
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleRemoveImage = (indexToRemove, isExisting) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
    } else {
      setImages(images.filter((_, index) => index !== indexToRemove));
      setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...variants];
    newVariants[index][name] = value;

    const original = parseFloat(newVariants[index].originalPrice);
    const disc = parseFloat(newVariants[index].discount);
    const price = parseFloat(newVariants[index].price);

    if (name === 'originalPrice') {
      if (!isNaN(original) && original > 0) {
        if (!isNaN(price)) {
          newVariants[index].discount = (((original - price) / original) * 100).toFixed(2);
        } else if (!isNaN(disc)) {
          newVariants[index].price = Math.round(original - (original * disc / 100));
        }
      }
    } else if (name === 'discount') {
      if (!isNaN(disc)) {
        if (!isNaN(price) && disc < 100) {
          newVariants[index].originalPrice = Math.round(price / (1 - disc / 100));
        } else if (!isNaN(original)) {
          newVariants[index].price = Math.round(original - (original * disc / 100));
        }
      }
    } else if (name === 'price') {
      if (!isNaN(price)) {
        if (!isNaN(original) && original > 0) {
          newVariants[index].discount = (((original - price) / original) * 100).toFixed(2);
        } else if (!isNaN(disc) && disc < 100) {
          newVariants[index].originalPrice = Math.round(price / (1 - disc / 100));
        }
      }
    }

    setVariants(newVariants);
  };

  const addVariant = () => setVariants([...variants, { size: '', price: '', originalPrice: '', discount: '', countInStock: '' }]);
  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handlePincodeRowChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...pincodePricingRows];
    updated[index][name] = value;

    const original = parseFloat(updated[index].originalPrice);
    const disc = parseFloat(updated[index].discount);
    const price = parseFloat(updated[index].price);

    if (name === 'originalPrice') {
      if (!isNaN(original) && original > 0) {
        if (!isNaN(price)) {
          updated[index].discount = (((original - price) / original) * 100).toFixed(2);
        } else if (!isNaN(disc)) {
          updated[index].price = Math.round(original - (original * disc / 100));
        }
      }
    } else if (name === 'discount') {
      if (!isNaN(disc)) {
        if (!isNaN(price) && disc < 100) {
          updated[index].originalPrice = Math.round(price / (1 - disc / 100));
        } else if (!isNaN(original)) {
          updated[index].price = Math.round(original - (original * disc / 100));
        }
      }
    } else if (name === 'price') {
      if (!isNaN(price)) {
        if (!isNaN(original) && original > 0) {
          updated[index].discount = (((original - price) / original) * 100).toFixed(2);
        } else if (!isNaN(disc) && disc < 100) {
          updated[index].originalPrice = Math.round(price / (1 - disc / 100));
        }
      }
    }

    setPincodePricingRows(updated);
  };

  const addPincodeRow = () => setPincodePricingRows([...pincodePricingRows, { pincodes: '', size: '', originalPrice: '', discount: '', price: '', inventory: '' }]);
  const removePincodeRow = (index) => {
    const updated = [...pincodePricingRows];
    updated.splice(index, 1);
    setPincodePricingRows(updated.length ? updated : [{ pincodes: '', size: '', originalPrice: '', discount: '', price: '', inventory: '' }]);
  };

  const buildPincodePricingPayload = () => {
    const expanded = [];
    pincodePricingRows.forEach((row) => {
      if (!row.pincodes || row.price === '' || row.inventory === '') return;
      extractPincodes(row.pincodes)
        .forEach((pincode) => {
          expanded.push({
            pincode,
            location: pincodeLocationMap[pincode] || '',
            size: row.size,
            originalPrice: row.originalPrice !== '' ? Number(row.originalPrice) : null,
            discount: row.discount !== '' ? Number(row.discount) : null,
            price: Number(row.price),
            inventory: Number(row.inventory),
          });
        });
    });
    return expanded;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    data.append('variants', JSON.stringify(variants));
    data.append('pincodePricing', JSON.stringify(buildPincodePricingPayload()));
    for (const image of images) data.append('images', image);
    if (videoFile) data.append('video', videoFile);

    try {
      await apiClient.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      alert('Product added successfully!');
      resetForm();
      setRefreshProducts(prev => !prev);
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product.');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category._id,
      gender: product.gender,
      subCategory: product.subCategory || '',
      isFeatured: product.isFeatured || false,
      isBestseller: product.isBestseller || false,
      videoUrl: product.videoUrl || '',
      farmerName: product.farmerName || '',
      farmerPhone: product.farmerPhone || '',
      farmerLocation: product.farmerLocation || '',
      farmerEmail: product.farmerEmail || '',
      isComingSoon: product.isComingSoon || false,
    });
    setVariants(product.variants.map(v => ({
      ...v,
      originalPrice: v.originalPrice || '',
      discount: v.discount || ''
    })));
    setPincodePricingRows(
      product.pincodePricing && product.pincodePricing.length > 0
        ? product.pincodePricing.map((entry) => ({
          pincodes: entry.pincode || '',
          size: entry.size || '',
          originalPrice: entry.originalPrice ?? '',
          discount: entry.discount ?? '',
          price: entry.price ?? '',
          inventory: entry.inventory ?? '',
        }))
        : [{ pincodes: '', size: '', originalPrice: '', discount: '', price: '', inventory: '' }]
    );
    setPincodeLocationMap(
      (product.pincodePricing || []).reduce((acc, entry) => {
        if (entry.pincode && entry.location) acc[entry.pincode] = entry.location;
        return acc;
      }, {})
    );
    setExistingImages(product.images);
    setImages([]);
    setImagePreviews([]);
    setVideoFile(null);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    data.append('variants', JSON.stringify(variants));
    data.append('pincodePricing', JSON.stringify(buildPincodePricingPayload()));
    for (const image of images) data.append('images', image);
    for (const imageUrl of existingImages) data.append('existingImages', imageUrl);
    if (videoFile) data.append('video', videoFile);

    try {
      await apiClient.put(`/products/${editingProduct._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      alert('Product updated successfully!');
      resetForm();
      setRefreshProducts(prev => !prev);
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      alert('Product deleted successfully!');
      setRefreshProducts(prev => !prev);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product.');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      brand: '',
      category: '',
      gender: '',
      subCategory: '',
      isFeatured: false,
      isBestseller: false,
      videoUrl: '',
      farmerName: '',
      farmerPhone: '',
      farmerLocation: '',
      farmerEmail: '',
      isComingSoon: false
    });
    setVariants([{ size: '', price: '', originalPrice: '', discount: '', countInStock: '' }]);
    setPincodePricingRows([{ pincodes: '', size: '', originalPrice: '', discount: '', price: '', inventory: '' }]);
    setPincodeLocationMap({});
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setVideoFile(null);
  };

  return (
    <div className="p-4 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[2.5rem] animate-fade-in">
      <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter name" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Enter brand" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" required />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the product..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-h-[100px]" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <input type="checkbox" name="isFeatured" id="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-4 h-4 rounded accent-blue-600" />
            <label htmlFor="isFeatured" className="text-[10px] font-black text-blue-700 uppercase tracking-wider cursor-pointer">Featured</label>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50/50 rounded-xl border border-green-100/50">
            <input type="checkbox" name="isBestseller" id="isBestseller" checked={formData.isBestseller} onChange={handleInputChange} className="w-4 h-4 rounded accent-green-600" />
            <label htmlFor="isBestseller" className="text-[10px] font-black text-green-700 uppercase tracking-wider cursor-pointer">Bestseller</label>
          </div>
          <div className="flex items-center gap-2 p-3 bg-yellow-50/50 rounded-xl border border-yellow-100/50">
            <input type="checkbox" name="isComingSoon" id="isComingSoon" checked={formData.isComingSoon} onChange={handleInputChange} className="w-4 h-4 rounded accent-yellow-600" />
            <label htmlFor="isComingSoon" className="text-[10px] font-black text-yellow-700 uppercase tracking-wider cursor-pointer">Upcoming</label>
          </div>
        </div>


        {/* Category */}
        {/* Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    setShowCategoryForm(true);
                    setFormData({ ...formData, category: "" });
                  } else {
                    setShowCategoryForm(false);
                    handleInputChange(e);
                  }
                }}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
                <option value="new">+ Create New Category</option>
              </select>
            </div>


            {/* Show new category form if selected */}
            {showCategoryForm && (
              <div className="p-4 border rounded-md bg-gray-50 mt-2">
                <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setNewCategoryImage(file);
                    setNewCategoryImagePreview(URL.createObjectURL(file));
                  }}
                  className="w-full p-2 border rounded-md mb-2"
                />
                {newCategoryImagePreview && (
                  <img src={newCategoryImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md mb-2" />
                )}
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      const data = new FormData();
                      data.append("name", newCategoryName);
                      if (newCategoryImage) data.append("image", newCategoryImage);

                      const res = await apiClient.post("/categories", data, {
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                      });

                      alert("Category created!");
                      setCategories([...categories, res.data]);
                      setFormData({ ...formData, category: res.data._id });
                      setShowCategoryForm(false);
                      setNewCategoryName("");
                      setNewCategoryImage(null);
                      setNewCategoryImagePreview(null);
                    } catch (err) {
                      console.error(err);
                      alert("Failed to create category");
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Save Category
                </button>
              </div>
            )}

            {/* Manage Existing Categories */}
            <div className="mt-4 p-4 border rounded-md bg-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Existing Categories (Click &times; to delete)</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <div key={cat._id} className="flex items-center bg-white border border-gray-300 rounded-full pl-3 pr-1 py-1 shadow-sm hover:border-red-300 transition-all group">
                    <span className="text-xs font-bold text-gray-700 mr-2">{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white rounded-full p-1 transition-all"
                      title={`Delete ${cat.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>


            {/* Item Type (Mapped to Gender field) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Type</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer" required>
                <option value="">Select Type</option>
                <option value="standard">Standard</option>
                <option value="organic">Organic</option>
                <option value="premium">Premium</option>
                <option value="budget">Budget</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sub Category</label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                placeholder="e.g. Fruits, Dairy..."
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Video (Optional)</label>
              <div className="relative group">
                <input
                  type="file"
                  name="video"
                  accept="video/*,image/*"
                  onChange={handleVideoChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                />
              </div>
            </div>
          </div>
        </div>


        <div className="bg-gray-50/50 p-4 md:p-6 rounded-2xl border border-gray-100">
          <h3 className="text-sm font-black text-gray-900 mb-4 tracking-widest uppercase">Farmer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
              <input type="text" name="farmerName" value={formData.farmerName} onChange={handleInputChange} placeholder="Farmer Name" className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
              <input type="text" name="farmerPhone" value={formData.farmerPhone} onChange={handleInputChange} placeholder="Contact Number" className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
              <input type="text" name="farmerLocation" value={formData.farmerLocation} onChange={handleInputChange} placeholder="Location" className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <input type="email" name="farmerEmail" value={formData.farmerEmail} onChange={handleInputChange} placeholder="Email" className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none" />
            </div>
          </div>
        </div>


        <div className="bg-gray-50/50 p-4 md:p-6 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-gray-900 tracking-widest uppercase">Global Variants</h3>
            <button type="button" onClick={addVariant} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all">Add +</button>
          </div>
          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-2 md:flex items-end gap-2 bg-white p-3 rounded-xl border border-gray-100 relative group">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase">Pack/Size</label>
                  <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} placeholder="e.g. 500g" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase">Orig. Price</label>
                  <input type="number" name="originalPrice" value={variant.originalPrice} onChange={(e) => handleVariantChange(index, e)} placeholder="MRP" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase">Disc %</label>
                  <input type="number" name="discount" value={variant.discount} onChange={(e) => handleVariantChange(index, e)} placeholder="%" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase">Sale Price</label>
                  <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Selling" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase">Stock</label>
                  <input type="number" name="countInStock" value={variant.countInStock} onChange={(e) => handleVariantChange(index, e)} placeholder="Qty" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" required />
                </div>
                <button type="button" onClick={() => removeVariant(index)} className="md:relative absolute top-2 right-2 bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>


        <div className="bg-gray-50/50 p-4 md:p-6 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-gray-900 tracking-widest uppercase">Pincode Specific Rules</h3>
            <button type="button" onClick={addPincodeRow} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all">Add +</button>
          </div>
          <div className="space-y-4">
            {pincodePricingRows.map((row, index) => (
              <div key={`pincode-row-${index}`} className="bg-white p-4 rounded-xl border border-gray-100 relative">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Target Pincodes (Comma separated)</label>
                    <input type="text" name="pincodes" value={row.pincodes} onChange={(e) => handlePincodeRowChange(index, e)} placeholder="e.g. 110001, 110002" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:flex items-end gap-3">
                  <div className="space-y-1 flex-grow">
                    <label className="text-[8px] font-black text-gray-400 uppercase">Pack Size</label>
                    <input type="text" name="size" value={row.size} onChange={(e) => handlePincodeRowChange(index, e)} placeholder="Pack Size" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" required />
                  </div>
                  <div className="space-y-1 w-24">
                    <label className="text-[8px] font-black text-gray-400 uppercase">Orig. Price</label>
                    <input type="number" name="originalPrice" value={row.originalPrice} onChange={(e) => handlePincodeRowChange(index, e)} placeholder="MRP" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" />
                  </div>
                  <div className="space-y-1 w-16">
                    <label className="text-[8px] font-black text-gray-400 uppercase">Disc %</label>
                    <input type="number" name="discount" value={row.discount} onChange={(e) => handlePincodeRowChange(index, e)} placeholder="%" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" />
                  </div>
                  <div className="space-y-1 w-24">
                    <label className="text-[8px] font-black text-gray-400 uppercase">Sale Price</label>
                    <input type="number" name="price" value={row.price} onChange={(e) => handlePincodeRowChange(index, e)} placeholder="Selling" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" />
                  </div>
                  <div className="space-y-1 w-20">
                    <label className="text-[8px] font-black text-gray-400 uppercase">Inventory</label>
                    <input type="number" name="inventory" value={row.inventory} onChange={(e) => handlePincodeRowChange(index, e)} placeholder="Qty" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black outline-none" />
                  </div>
                  <button type="button" onClick={() => removePincodeRow(index)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
                  </button>
                </div>
                <div className="mt-3 p-2 bg-blue-50/50 rounded-lg border border-blue-100/30">
                  <p className="text-[9px] font-black text-blue-600 uppercase leading-tight tracking-wider">
                    Resolved: {extractPincodes(row.pincodes)
                      .map((pincode) => pincodeLocationMap[pincode] ? pincodeLocationMap[pincode] : `Fetching...`)
                      .join(', ') || 'Waiting for pincodes...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Images */}
        <div className="bg-gray-50/50 p-4 md:p-6 rounded-2xl border border-gray-100">
          <h3 className="text-sm font-black text-gray-900 mb-4 tracking-widest uppercase">Product Images</h3>
          <div className="space-y-4">
            <input type="file" name="images" multiple onChange={handleImageChange} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all" />
            <div className="flex flex-wrap gap-3">
              {existingImages.map((url, idx) => (
                <div key={`ex-${idx}`} className="relative group">
                  <img src={url} alt="" className="h-20 w-20 md:h-24 md:w-24 object-cover rounded-xl border border-gray-200 shadow-sm" />
                  <button type="button" onClick={() => handleRemoveImage(idx, true)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm shadow-lg transform group-hover:scale-110 transition-all">&times;</button>
                </div>
              ))}
              {imagePreviews.map((preview, idx) => (
                <div key={`new-${idx}`} className="relative group">
                  <img src={preview} alt="" className="h-20 w-20 md:h-24 md:w-24 object-cover rounded-xl border border-gray-200 shadow-sm" />
                  <button type="button" onClick={() => handleRemoveImage(idx, false)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm shadow-lg transform group-hover:scale-110 transition-all">&times;</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] uppercase tracking-widest">
            {editingProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
          </button>
          {editingProduct && (
            <button type="button" onClick={resetForm} className="sm:w-32 bg-gray-100 hover:bg-gray-200 text-gray-500 p-4 rounded-xl text-xs font-black transition-all uppercase tracking-widest">
              CANCEL
            </button>
          )}
        </div>
      </form>


      {/* Existing Products */}
      <div className="mt-12">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight">Existing Products</h2>
        <div className="grid grid-cols-1 gap-4">
          {products.map(product => (
            <div key={product._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="w-full md:w-24 h-40 md:h-24 shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-xl border border-gray-50" />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">{product.brand}</span>
                    <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{product.category?.name || 'N/A'}</span>
                    <h3 className="w-full md:w-auto text-sm font-black text-gray-900">{product.name}</h3>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Variants</p>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-600">
                      {product.variants.map(v => (
                        <span key={v._id || v.size} className={`px-2 py-1 rounded-lg border ${v.countInStock <= 0 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-gray-50 border-gray-100'}`}>
                          {v.size}: {v.countInStock <= 0 ? 'OUT' : `₹${v.price} (${v.countInStock})`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {product.pincodePricing && product.pincodePricing.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pincode Rules</p>
                      <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-500 opacity-80">
                        {product.pincodePricing.map((rule, idx) => (
                          <span key={`${product._id}-rule-${idx}`} className="bg-blue-50/50 px-2 py-1 rounded-lg">
                            {rule.pincode}: ₹{rule.price} ({rule.inventory})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <p className="text-[10px] font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full uppercase">
                      Total Stock: {product.variants.reduce((acc, v) => acc + (v.countInStock || 0), 0)}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(product)} className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl text-[10px] font-black transition-all">EDIT</button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="px-4 py-2 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black transition-all">DELETE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;

