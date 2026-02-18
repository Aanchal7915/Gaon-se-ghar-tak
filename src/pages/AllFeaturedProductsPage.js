// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import ProductCard from '../components/ProductCard';
// import LoadingSpinner from '../components/LoadingSpinner';

// const AllFeaturedProductsPage = () => {
//     const { subCategory } = useParams();
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchAllFeaturedProducts = async () => {
//             try {
//                 setLoading(true);
//                 const response = await fetch(`/products/subcategory/${subCategory}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch products');
//                 }
//                 const data = await response.json();
//                 setProducts(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (subCategory) {
//             fetchAllFeaturedProducts();
//         }
//     }, [subCategory]);

//     if (loading) {
//         return <LoadingSpinner />
//     }
//     if (error) {
//         return <div className="text-center py-12 text-red-500">Error: {error}</div>;
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-4xl font-bold text-center mb-10">All Featured Products</h1>
//             {products.length === 0 ? (
//                 <p className="text-center text-lg text-gray-600">No products found in this category.</p>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//                     {products.map((product) => (
//                         <ProductCard key={product._id} product={product} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AllFeaturedProductsPage;

// src/pages/AllFeaturedProductsPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import ProductCard from "../components/ProductCard";
// import LoadingSpinner from "../components/LoadingSpinner";
// import FilterSidebar from "../components/FilterSidebar";

// const AllFeaturedProductsPage = () => {
//   const { subCategory } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Filters state
//   const [filters, setFilters] = useState({
//     price: [0, 100000],
//     gender: [],
//     category: [],
//     subCategory: [],
//     size: [],
//     brand: [],
//   });

//   useEffect(() => {
//     const fetchAllFeaturedProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `/products/subcategory/${subCategory}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch products");
//         const data = await response.json();

//         // Ensure price is number
//         const normalized = data.map((p) => ({
//           ...p,
//           price: Number(p.price),
//         }));

//         setProducts(normalized);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (subCategory) fetchAllFeaturedProducts();
//   }, [subCategory]);

//   if (loading) return <LoadingSpinner />;
//   if (error)
//     return <div className="text-center py-12 text-red-500">Error: {error}</div>;

//   // ✅ Apply filters
//   const filteredProducts = products.filter((p) => {
//     if (p.price < filters.price[0] || p.price > filters.price[1]) return false;
//     if (filters.gender.length && !filters.gender.includes(p.gender))
//       return false;
//     if (filters.category.length && !filters.category.includes(p.categoryName))
//       return false;
//     if (
//       filters.subCategory.length &&
//       !filters.subCategory.includes(p.subCategoryName)
//     )
//       return false;
//     if (filters.size.length && !filters.size.includes(p.size)) return false;
//     if (filters.brand.length && !filters.brand.includes(p.brand)) return false;
//     return true;
//   });

//   // ✅ Extract unique values with human-readable names
//   const categories = [
//     ...new Set(products.map((p) => p.categoryName || p.category).filter(Boolean)),
//   ];
//   const subCategories = [
//     ...new Set(
//       products.map((p) => p.subCategoryName || p.subCategory).filter(Boolean)
//     ),
//   ];
//   const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

//   return (
//     <div className="container mx-auto px-4 py-8 flex gap-8">
//       {/* Sidebar */}
//       <div className="w-1/4 hidden md:block">
//         <FilterSidebar
//           filters={filters}
//           setFilters={setFilters}
//           categories={categories}
//           subCategories={subCategories}
//           brands={brands}
//           products={products}
//         />
//       </div>

//       {/* Products */}
//       <div className="flex-1">
//         <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
//           All Featured Products
//         </h1>

//         {filteredProducts.length === 0 ? (
//           <p className="text-center text-lg text-gray-600">
//             No products found in this category.
//           </p>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
//             {filteredProducts.map((product) => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllFeaturedProductsPage;


import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import FilterSidebar from "../components/FilterSidebar";

const AllFeaturedProductsPage = () => {
  const { subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state (price will be set once products load)
  const [filters, setFilters] = useState({
    price: [0, 100000],
    gender: [],
    category: [],
    subCategory: [],
    size: [],
    brand: [],
  });

  // mobile drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchAllFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/products/subcategory/${subCategory}`);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };
    if (subCategory) fetchAllFeaturedProducts();
  }, [subCategory]);


  // When products load, compute global min/max from variants or top-level price
  useEffect(() => {
    if (!products?.length) return;

    const allPrices = products.flatMap((p) => {
      // prefer variants if available
      if (Array.isArray(p.variants) && p.variants.length) {
        return p.variants
          .map((v) => Number(v?.price ?? v?.amount ?? NaN))
          .filter((n) => !Number.isNaN(n));
      }
      // fallback to top-level price
      if (p.price != null) {
        const n = Number(p.price);
        return Number.isNaN(n) ? [] : [n];
      }
      return [];
    });

    if (allPrices.length) {
      const min = Math.min(...allPrices);
      const max = Math.max(...allPrices);
      setFilters((prev) => {
        const [curMin, curMax] = prev.price ?? [0, 0];
        if (curMin !== min || curMax !== max) {
          return { ...prev, price: [min, max] };
        }
        return prev;
      });
    }
  }, [products]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  // Normalize helper for category/brand values (object or string)
  const normalizeValue = (val) => (typeof val === "string" ? val : val?.name || "");

  // Build unique filter lists (strings only), no duplicates
  const categories = [
    ...new Set(products.map((p) => normalizeValue(p.category)).filter(Boolean)),
  ].sort();
  const subCategories = [
    ...new Set(products.map((p) => normalizeValue(p.subCategory)).filter(Boolean)),
  ].sort();
  const brands = [
    ...new Set(products.map((p) => normalizeValue(p.brand)).filter(Boolean)),
  ].sort();

  // Filtering logic: priceMatch checks any variant or top-level price falls inside range
  const filteredProducts = products.filter((p) => {
    const [minFilter, maxFilter] = filters.price ?? [0, Infinity];

    // gather all numeric prices for the product
    const productPrices =
      Array.isArray(p.variants) && p.variants.length
        ? p.variants.map((v) => Number(v?.price)).filter((n) => !Number.isNaN(n))
        : p.price != null
          ? [Number(p.price)].filter((n) => !Number.isNaN(n))
          : [];

    // if no price info, exclude product
    if (!productPrices.length) return false;

    const priceMatch = productPrices.some(
      (price) => price >= minFilter && price <= maxFilter
    );
    if (!priceMatch) return false;

    // other filters (normalize values before comparing)
    if (filters.gender.length && !filters.gender.includes(p.gender)) return false;

    const productCategory = normalizeValue(p.category);
    if (filters.category.length && !filters.category.includes(productCategory))
      return false;

    const productSubCategory = normalizeValue(p.subCategory);
    if (
      filters.subCategory.length &&
      !filters.subCategory.includes(productSubCategory)
    )
      return false;

    // you might keep sizes inside variants; implement if required
    if (filters.size.length) {
      const sizes =
        Array.isArray(p.variants)
          ? p.variants.map((v) => String(v.size)).filter(Boolean)
          : p.size
            ? [String(p.size)]
            : [];
      if (!sizes.some((s) => filters.size.includes(s))) return false;
    }

    const productBrand = normalizeValue(p.brand);
    if (filters.brand.length && !filters.brand.includes(productBrand))
      return false;

    return true;
  });

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
        {/* Desktop sidebar */}
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

        {/* Products area */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-center mb-10">
            Our Best Products
          </h1>

          {filteredProducts.length === 0 ? (
            <p className="text-center text-lg text-gray-600">
              No products found.
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

      {/* Mobile drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-3/4 max-w-xs bg-white shadow-lg h-full p-4 overflow-y-auto">
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

export default AllFeaturedProductsPage;