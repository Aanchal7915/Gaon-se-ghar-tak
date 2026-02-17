
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import FilterSidebar from "../components/FilterSidebar";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../services/apiClient";

const GenderProductsPage = () => {
  const { type: gender } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Filters state
  const [filters, setFilters] = useState({
    price: [0, 100000],
    gender: [],
    category: [],
    subCategory: [],
    size: [],
    brand: [],
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProductsByGender = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/products/gender/${gender}`);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (gender) {
      fetchProductsByGender();
    }
  }, [gender]);


  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  // ✅ Apply filters
  const filteredProducts = products.filter((p) => {
    if (p.price < filters.price[0] || p.price > filters.price[1]) return false;
    if (filters.gender.length && !filters.gender.includes(p.gender)) return false;
    if (filters.category.length && !filters.category.includes(p.category)) return false;
    if (filters.subCategory.length && !filters.subCategory.includes(p.subCategory))
      return false;
    if (filters.size.length && !filters.size.includes(p.size)) return false;
    if (filters.brand.length && !filters.brand.includes(p.brand)) return false;
    return true;
  });

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const subCategories = [...new Set(products.map((p) => p.subCategory).filter(Boolean))];
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile filter button */}
      <div className="md:hidden mb-4 flex justify-start">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-semibold shadow-sm flex items-center gap-1"
        >
          Open Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar (desktop) */}
        <div className="w-1/4 hidden md:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            subCategories={subCategories}
            brands={brands}
            products={products}
          />
        </div>

        {/* Products */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 capitalize">
            Explore our {gender} range
          </h1>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-lg text-gray-600">
              No products found for this selection.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFilterOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative w-3/4 max-w-xs bg-white shadow-lg h-full p-4 overflow-y-auto animate-slideIn">
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mb-4 px-3 py-1 bg-red-500 text-white rounded"
            >
              Close
            </button>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              subCategories={subCategories}
              brands={brands}
              products={products}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GenderProductsPage;
