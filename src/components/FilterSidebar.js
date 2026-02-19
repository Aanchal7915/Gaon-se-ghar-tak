// // src/components/FilterSidebar.jsx
// import React, { useState, useEffect } from "react";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";

// const FilterSidebar = ({
//   filters,
//   setFilters,
//   categories = [],
//   subCategories = [],
//   brands = [],
//   products = [],
// }) => {
//   const [maxPrice, setMaxPrice] = useState(100000);

//   useEffect(() => {
//     if (Array.isArray(products) && products.length > 0) {
//       const validPrices = products
//         .map((p) => (p && typeof p.price === "number" ? p.price : null))
//         .filter((price) => price !== null);

//       if (validPrices.length > 0) {
//         setMaxPrice(Math.max(...validPrices));
//       }
//     }
//   }, [products]);

//   const handleChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   // ✅ Always provide safe defaults
//   const priceRange = filters?.price ?? [0, maxPrice];
//   const gender = filters?.gender ?? [];
//   const category = filters?.category ?? [];
//   const subCategory = filters?.subCategory ?? [];
//   const size = filters?.size ?? [];
//   const brand = filters?.brand ?? [];

//   return (
//     <aside className="w-full md:w-64 bg-white shadow-lg rounded-2xl p-6 mb-8 md:mb-0">
//       <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

//       {/* Price Filter */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">
//           Price (₹{priceRange[0]} - ₹{priceRange[1]})
//         </h3>
//         <Slider
//           range
//           min={0}
//           max={maxPrice}
//           step={500}
//           value={priceRange}
//           onChange={(val) => handleChange("price", val)}
//           trackStyle={[{ backgroundColor: "#0c831f" }]}
//           handleStyle={[
//             { borderColor: "#0c831f" },
//             { borderColor: "#0c831f" },
//           ]}
//         />
//       </div>

//       {/* Gender */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Gender</h3>
//         {["male", "female", "unisex", "boys", "girls"].map((g) => (
//           <label key={g} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={gender.includes(g)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...gender, g]
//                   : gender.filter((x) => x !== g);
//                 handleChange("gender", newVal);
//               }}
//               className="mr-2 accent-green-600"
//             />
//             {g.charAt(0).toUpperCase() + g.slice(1)}
//           </label>
//         ))}
//       </div>

//       {/* Category */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Category</h3>
//         {categories.map((c) => (
//           <label key={c} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={category.includes(c)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...category, c]
//                   : category.filter((x) => x !== c);
//                 handleChange("category", newVal);
//               }}
//               className="mr-2 accent-green-600"
//             />
//             {c}
//           </label>
//         ))}
//       </div>

//       {/* SubCategory */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Sub Category</h3>
//         {subCategories.map((sc) => (
//           <label key={sc} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={subCategory.includes(sc)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...subCategory, sc]
//                   : subCategory.filter((x) => x !== sc);
//                 handleChange("subCategory", newVal);
//               }}
//               className="mr-2 accent-green-600"
//             />
//             {sc}
//           </label>
//         ))}
//       </div>

//       {/* Size */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Size</h3>
//         {["6", "7", "8", "9", "10", "11"].map((s) => (
//           <label key={s} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={size.includes(s)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...size, s]
//                   : size.filter((x) => x !== s);
//                 handleChange("size", newVal);
//               }}
//               className="mr-2 accent-green-600"
//             />
//             {s}
//           </label>
//         ))}
//       </div>

//       {/* Brand */}
//       <div>
//         <h3 className="font-semibold mb-2">Brand</h3>
//         {brands.map((b) => (
//           <label key={b} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={brand.includes(b)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...brand, b]
//                   : brand.filter((x) => x !== b);
//                 handleChange("brand", newVal);
//               }}
//               className="mr-2 accent-green-600"
//             />
//             {b}
//           </label>
//         ))}
//       </div>
//     </aside>
//   );
// };

// export default FilterSidebar;

// src/components/FilterSidebar.jsx
// import React, { useState, useEffect } from "react";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";

// const FilterSidebar = ({
//   filters,
//   setFilters,
//   categories = [],
//   subCategories = [],
//   brands = [],
//   products = [],
// }) => {
//   const [maxPrice, setMaxPrice] = useState(100000);

//   useEffect(() => {
//     if (Array.isArray(products) && products.length > 0) {
//       const validPrices = products
//         .map((p) => (p && typeof p.price === "number" ? p.price : null))
//         .filter((price) => price !== null);

//       if (validPrices.length > 0) {
//         setMaxPrice(Math.max(...validPrices));
//       }
//     }
//   }, [products]);

//   const handleChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   // ✅ Always provide safe defaults
//   const priceRange = filters?.price ?? [0, maxPrice];
//   const gender = filters?.gender ?? [];
//   const category = filters?.category ?? [];
//   const subCategory = filters?.subCategory ?? [];
//   const size = filters?.size ?? [];
//   const brand = filters?.brand ?? [];

//   // ✅ Normalize everything to strings (name if object, else raw string)
//   const normalizedCategories = categories.map((c) =>
//     typeof c === "string" ? c : c?.name || c?._id || ""
//   );
//   const normalizedSubCategories = subCategories.map((sc) =>
//     typeof sc === "string" ? sc : sc?.name || sc?._id || ""
//   );
//   const normalizedBrands = brands.map((b) =>
//     typeof b === "string" ? b : b?.name || b?._id || ""
//   );

//   return (
//     <aside className="w-full md:w-64 bg-white shadow-lg rounded-2xl p-6 mb-8 md:mb-0">
//       <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

//       {/* Price Filter */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">
//           Price (₹{priceRange[0]} - ₹{priceRange[1]})
//         </h3>
//         <Slider
//           range
//           min={0}
//           max={maxPrice}
//           step={500}
//           value={priceRange}
//           onChange={(val) => handleChange("price", val)}
//           trackStyle={[{ backgroundColor: "#0c831f" }]}
//           handleStyle={[
//             { borderColor: "#0c831f" },
//             { borderColor: "#0c831f" },
//           ]}
//         />
//       </div>

//       {/* Gender */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Gender</h3>
//         {["male", "female", "unisex", "boys", "girls"].map((g) => (
//           <label key={g} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={gender.includes(g)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...gender, g]
//                   : gender.filter((x) => x !== g);
//                 handleChange("gender", newVal);
//               }}
//               className="mr-2 accent-green-600"
//             />
//             {g.charAt(0).toUpperCase() + g.slice(1)}
//           </label>
//         ))}
//       </div>

//       {/* Category */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Category</h3>
//         {normalizedCategories.map((c) =>
//           c ? (
//             <label key={c} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={category.includes(c)}
//                 onChange={(e) => {
//                   const newVal = e.target.checked
//                     ? [...category, c]
//                     : category.filter((x) => x !== c);
//                   handleChange("category", newVal);
//                 }}
//                 className="mr-2 accent-green-600"
//               />
//               {c}
//             </label>
//           ) : null
//         )}
//       </div>

//       {/* SubCategory */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Sub Category</h3>
//         {normalizedSubCategories.map((sc) =>
//           sc ? (
//             <label key={sc} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={subCategory.includes(sc)}
//                 onChange={(e) => {
//                   const newVal = e.target.checked
//                     ? [...subCategory, sc]
//                     : subCategory.filter((x) => x !== sc);
//                   handleChange("subCategory", newVal);
//                 }}
//                 className="mr-2 accent-green-600"
//               />
//               {sc}
//             </label>
//           ) : null
//         )}
//       </div>

//       {/* Size */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Size</h3>
//         {["6", "7", "8", "9", "10", "11"].map((s) => (
//           <label key={s} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={size.includes(s)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...size, s]
//                   : size.filter((x) => x !== s);
//                 handleChange("size", newVal);
//               }}
//               className="mr-2 accent-green-600"
//             />
//             {s}
//           </label>
//         ))}
//       </div>

//       {/* Brand */}
//       <div>
//         <h3 className="font-semibold mb-2">Brand</h3>
//         {normalizedBrands.map((b) =>
//           b ? (
//             <label key={b} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={brand.includes(b)}
//                 onChange={(e) => {
//                   const newVal = e.target.checked
//                     ? [...brand, b]
//                     : brand.filter((x) => x !== b);
//                   handleChange("brand", newVal);
//                 }}
//                 className="mr-2 accent-green-600"
//               />
//               {b}
//             </label>
//           ) : null
//         )}
//       </div>
//     </aside>
//   );
// };

// export default FilterSidebar;

import React, { useMemo, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { HiChevronDown, HiChevronUp, HiOutlineX } from "react-icons/hi";

const FilterSidebar = ({
  filters,
  setFilters,
  categories = [],
  subCategories = [],
  brands = [],
  products = [],
}) => {
  // Section toggle state
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    itemType: true,
    category: true,
    subCategory: false,
    size: false,
    brand: false,
  });

  // Show more/less states
  const [showAllCats, setShowAllCats] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const normalizeValue = (val) =>
    typeof val === "string" ? val : val?.name || val?._id || "";

  const { minPrice, maxPrice } = useMemo(() => {
    const prices = [];
    (products || []).forEach((p) => {
      if (Array.isArray(p.variants) && p.variants.length) {
        p.variants.forEach((v) => {
          const n = Number(v?.price ?? v?.amount);
          if (!Number.isNaN(n)) prices.push(n);
        });
      } else if (p.price != null) {
        const n = Number(p.price);
        if (!Number.isNaN(n)) prices.push(n);
      }
    });
    return {
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 100000,
    };
  }, [products]);

  const safeFilters = filters || {
    price: [minPrice, maxPrice],
    gender: [],
    category: [],
    subCategory: [],
    size: [],
    brand: [],
  };

  const priceRange = safeFilters.price ?? [minPrice, maxPrice];
  const gender = safeFilters.gender ?? [];
  const category = safeFilters.category ?? [];
  const subCategory = safeFilters.subCategory ?? [];
  const size = safeFilters.size ?? [];
  const brand = safeFilters.brand ?? [];

  const categoryCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((p) => {
      const c = normalizeValue(p.category);
      if (c) counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [products]);

  const subCategoryCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((p) => {
      const sc = normalizeValue(p.subCategory);
      if (sc) counts[sc] = (counts[sc] || 0) + 1;
    });
    return counts;
  }, [products]);

  const brandCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((p) => {
      const b = normalizeValue(p.brand);
      if (b) counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
  }, [products]);

  const sizeCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((p) => {
      if (Array.isArray(p.variants)) {
        const productSizes = new Set();
        p.variants.forEach((v) => {
          if (v.size) productSizes.add(v.size);
        });
        productSizes.forEach((s) => {
          counts[s] = (counts[s] || 0) + 1;
        });
      }
    });
    return counts;
  }, [products]);

  const normalizedCategories = useMemo(() =>
    Array.from(new Set(categories.map(normalizeValue).filter((c) => categoryCounts[c] > 0))).sort(),
    [categories, categoryCounts]);

  const normalizedSubCategories = useMemo(() =>
    Array.from(new Set(subCategories.map(normalizeValue).filter((sc) => subCategoryCounts[sc] > 0))).sort(),
    [subCategories, subCategoryCounts]);

  const normalizedBrands = useMemo(() =>
    Array.from(new Set(brands.map(normalizeValue).filter((b) => brandCounts[b] > 0))).sort(),
    [brands, brandCounts]);

  const normalizedSizes = useMemo(() => Object.keys(sizeCounts).sort(), [sizeCounts]);

  const handleChange = (key, value) => {
    if (typeof setFilters !== "function") return;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setFilters({
      price: [minPrice, maxPrice],
      gender: [],
      category: [],
      subCategory: [],
      size: [],
      brand: [],
    });
  };

  const SectionHeader = ({ title, section, clearKey }) => (
    <div
      className="flex items-center justify-between py-2 cursor-pointer group"
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-[13px] font-bold text-black uppercase tracking-wider">{title}</h3>
      <div className="flex items-center space-x-2">
        {safeFilters[clearKey]?.length > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); handleChange(clearKey, []); }}
            className="text-[10px] text-green-600 font-medium hover:underline px-1"
          >
            Reset
          </button>
        )}
        {expandedSections[section] ? <HiChevronUp className="text-gray-400 group-hover:text-green-600" /> : <HiChevronDown className="text-gray-400 group-hover:text-green-600" />}
      </div>
    </div>
  );

  return (
    <aside className="w-full md:w-64 bg-white border border-gray-100 rounded-xl p-4 mb-8 md:mb-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
        <h2 className="text-lg font-black text-gray-900">Filters</h2>
        <button
          onClick={clearAll}
          className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
        >
          <HiOutlineX className="w-3 h-3" /> Clear All
        </button>
      </div>

      {/* Price */}
      <div className="mb-4 border-b border-gray-50 pb-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[13px] font-bold text-black uppercase tracking-wider">Price Range</h3>
          <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </span>
        </div>
        <div className="px-2 pb-2">
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            step={50}
            value={priceRange}
            onChange={(val) => handleChange("price", val)}
            trackStyle={[{ backgroundColor: "#10b981", height: 4 }]}
            handleStyle={[
              { borderColor: "#10b981", height: 16, width: 16, marginTop: -6, backgroundColor: "#fff", boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
              { borderColor: "#10b981", height: 16, width: 16, marginTop: -6, backgroundColor: "#fff", boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
            ]}
            railStyle={{ height: 4 }}
          />
        </div>
      </div>

      {/* Item Type - COMPACT GRID */}
      <div className="mb-4 border-b border-gray-50 pb-2">
        <SectionHeader title="Item Type" section="itemType" clearKey="gender" />
        {expandedSections.itemType && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {["Standard", "Organic", "Premium", "Budget"].map((g) => (
              <button
                key={g}
                onClick={() => {
                  const val = g.toLowerCase();
                  const newVal = gender.includes(val) ? gender.filter(x => x !== val) : [...gender, val];
                  handleChange("gender", newVal);
                }}
                className={`text-[10px] font-bold py-1.5 px-2 rounded-md transition-all border ${gender.includes(g.toLowerCase())
                  ? "bg-green-600 border-green-600 text-white shadow-sm"
                  : "bg-gray-50 border-gray-100 text-black hover:border-green-200"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-4 border-b border-gray-50 pb-2">
        <SectionHeader title="Category" section="category" clearKey="category" />
        {expandedSections.category && (
          <div className="mt-2 space-y-1">
            {(showAllCats ? normalizedCategories : normalizedCategories.slice(0, 5)).map((c) => (
              <label key={c} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={category.includes(c)}
                    onChange={(e) => {
                      const newVal = e.target.checked ? [...category, c] : category.filter((x) => x !== c);
                      handleChange("category", newVal);
                    }}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600 cursor-pointer"
                  />
                </div>
                <span className={`ml-2 text-xs transition-colors ${category.includes(c) ? "font-bold text-black" : "text-black group-hover:text-black"}`}>
                  {c} <span className="text-[10px] text-gray-600 font-normal">({categoryCounts[c]})</span>
                </span>
              </label>
            ))}
            {normalizedCategories.length > 5 && (
              <button
                onClick={() => setShowAllCats(!showAllCats)}
                className="text-[10px] font-bold text-green-600 mt-1 hover:underline flex items-center"
              >
                {showAllCats ? "Show Less" : `+ ${normalizedCategories.length - 5} More`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* SubCategory */}
      <div className="mb-4 border-b border-gray-50 pb-2">
        <SectionHeader title="Sub Category" section="subCategory" clearKey="subCategory" />
        {expandedSections.subCategory && (
          <div className="mt-2 space-y-1">
            {normalizedSubCategories.map((sc) => (
              <label key={sc} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={subCategory.includes(sc)}
                  onChange={(e) => {
                    const newVal = e.target.checked ? [...subCategory, sc] : subCategory.filter((x) => x !== sc);
                    handleChange("subCategory", newVal);
                  }}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600 cursor-pointer"
                />
                <span className={`ml-2 text-xs ${subCategory.includes(sc) ? "font-bold text-black" : "text-black"}`}>
                  {sc} <span className="text-[10px] text-gray-600">({subCategoryCounts[sc]})</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size / Weight - COMPACT GRID */}
      <div className="mb-4 border-b border-gray-50 pb-2">
        <SectionHeader title="Pack Size" section="size" clearKey="size" />
        {expandedSections.size && (
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            {normalizedSizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  const newVal = size.includes(s) ? size.filter(x => x !== s) : [...size, s];
                  handleChange("size", newVal);
                }}
                className={`text-[9px] font-bold py-1 px-1 rounded border transition-all ${size.includes(s)
                  ? "bg-green-600 border-green-600 text-white shadow-sm"
                  : "bg-white border-gray-100 text-black hover:border-green-200"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-2">
        <SectionHeader title="Brand" section="brand" clearKey="brand" />
        {expandedSections.brand && (
          <div className="mt-2 space-y-1">
            {(showAllBrands ? normalizedBrands : normalizedBrands.slice(0, 5)).map((b) => (
              <label key={b} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={brand.includes(b)}
                  onChange={(e) => {
                    const newVal = e.target.checked ? [...brand, b] : brand.filter((x) => x !== b);
                    handleChange("brand", newVal);
                  }}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600 cursor-pointer"
                />
                <span className={`ml-2 text-xs ${brand.includes(b) ? "font-bold text-black" : "text-black"}`}>
                  {b} <span className="text-[10px] text-gray-600">({brandCounts[b]})</span>
                </span>
              </label>
            ))}
            {normalizedBrands.length > 5 && (
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-[10px] font-bold text-green-600 mt-1 hover:underline"
              >
                {showAllBrands ? "Show Less" : `+ ${normalizedBrands.length - 5} More`}
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;

