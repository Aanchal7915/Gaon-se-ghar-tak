

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
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newCategoryImagePreview, setNewCategoryImagePreview] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [variants, setVariants] = useState([{ size: '', price: '', originalPrice: '', countInStock: '' }]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [refreshCategories, refreshProducts]);

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

  const handleRemoveImage = (indexToRemove, isExisting) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
    } else {
      setImages(images.filter((_, index) => index !== indexToRemove));
      setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleVariantChange = (index, e) => {
    const newVariants = [...variants];
    newVariants[index][e.target.name] = e.target.value;
    setVariants(newVariants);
  };

  const addVariant = () => setVariants([...variants, { size: '', price: '', originalPrice: '', countInStock: '' }]);
  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    data.append('variants', JSON.stringify(variants));
    for (const image of images) data.append('images', image);

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
    });
    setVariants(product.variants.map(v => ({
      ...v,
      originalPrice: v.originalPrice || ''
    })));
    setExistingImages(product.images);
    setImages([]);
    setImagePreviews([]);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    data.append('variants', JSON.stringify(variants));
    for (const image of images) data.append('images', image);
    for (const imageUrl of existingImages) data.append('existingImages', imageUrl);

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
    setFormData({ name: '', description: '', brand: '', category: '', gender: '', subCategory: '', isFeatured: false, isBestseller: false });
    setVariants([{ size: '', price: '', originalPrice: '', countInStock: '' }]);
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full p-2 border rounded-md" required />
        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full p-2 border rounded-md" required />
        <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand" className="w-full p-2 border rounded-md" required />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={handleInputChange}
            className="w-4 h-4 accent-blue-600"
          />
          <label htmlFor="isFeatured" className="text-gray-700 font-medium cursor-pointer">
            Featured Product
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isBestseller"
            id="isBestseller"
            checked={formData.isBestseller}
            onChange={handleInputChange}
            className="w-4 h-4 accent-green-600"
          />
          <label htmlFor="isBestseller" className="text-gray-700 font-medium cursor-pointer">
            Best Seller Product
          </label>
        </div>

        {/* Category */}
        {/* Category */}
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
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
          <option value="new">+ Create New Category</option>
        </select>

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


        {/* Item Type (Mapped to Gender field) */}
        <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
          <option value="">Select Item Type</option>
          <option value="standard">Standard</option>
          <option value="organic">Organic</option>
          <option value="premium">Premium</option>
          <option value="budget">Budget</option>
        </select>

        {/* SubCategory */}
        <input
          type="text"
          name="subCategory"
          value={formData.subCategory}
          onChange={handleInputChange}
          placeholder="Sub Category (e.g., Fruits, Vegetables, Dairy)"
          className="w-full p-2 border rounded-md"
        />

        {/* Variants */}
        <h3 className="text-lg font-semibold">Product Variants</h3>
        {variants.map((variant, index) => (
          <div key={index} className="flex space-x-2">
            <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} placeholder="Pack/Size" className="w-full p-2 border rounded-md" required />
            <input type="number" name="originalPrice" value={variant.originalPrice} onChange={(e) => handleVariantChange(index, e)} placeholder="Original Price" className="w-full p-2 border rounded-md" />
            <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Selling Price" className="w-full p-2 border rounded-md" required />
            <input type="number" name="countInStock" value={variant.countInStock} onChange={(e) => handleVariantChange(index, e)} placeholder="Stock" className="w-full p-2 border rounded-md" required />
            <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white p-2 rounded-md">-</button>
          </div>
        ))}
        <button type="button" onClick={addVariant} className="bg-gray-200 text-gray-800 p-2 rounded-md">Add Variant</button>

        {/* Images */}
        <h3 className="text-lg font-semibold">Product Images</h3>
        <input type="file" name="images" multiple onChange={handleImageChange} className="w-full p-2 border rounded-md" />
        <div className="flex flex-wrap space-x-2 mt-2">
          {existingImages.map((url, idx) => (
            <div key={`ex-${idx}`} className="relative">
              <img src={url} alt="" className="h-24 w-24 object-cover rounded-md" />
              <button type="button" onClick={() => handleRemoveImage(idx, true)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
            </div>
          ))}
          {imagePreviews.map((preview, idx) => (
            <div key={`new-${idx}`} className="relative">
              <img src={preview} alt="" className="h-24 w-24 object-cover rounded-md" />
              <button type="button" onClick={() => handleRemoveImage(idx, false)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
            </div>
          ))}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button type="button" onClick={resetForm} className="w-full bg-gray-400 text-white p-2 rounded-md">Cancel</button>
        )}
      </form>

      {/* Existing Products */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Existing Products</h2>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
            <div className="flex items-center space-x-4">
              <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <span className="font-semibold">{product.name} - {product.brand}</span>
                <p className="text-sm text-gray-600">Category: {product.category?.name || 'N/A'}</p>
                <p className="text-sm text-gray-600">Type: {product.gender} | Sub: {product.subCategory || 'N/A'}</p>
                <p className="text-sm text-gray-600">Variants: {product.variants.map(v => `${v.size}(₹${v.price}${v.originalPrice ? ` [cut: ₹${v.originalPrice}]` : ''})`).join(', ')}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleEditClick(product)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Edit</button>
              <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
