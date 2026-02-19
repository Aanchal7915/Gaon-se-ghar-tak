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

import React, { useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FilterSidebar = ({
  filters,
  setFilters,
  categories = [],
  subCategories = [],
  brands = [],
  products = [],
}) => {
  // normalize helpers
  const normalizeValue = (val) =>
    typeof val === "string" ? val : val?.name || val?._id || "";

  // compute global min/max from products (variants or top-level price)
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

  // ensure safe filters
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

  // Build counts for category/subCategory/brand
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

  // final normalized options (only those with count > 0)
  const normalizedCategories = Array.from(
    new Set(categories.map(normalizeValue).filter((c) => categoryCounts[c] > 0))
  ).sort();

  const normalizedSubCategories = Array.from(
    new Set(subCategories.map(normalizeValue).filter((sc) => subCategoryCounts[sc] > 0))
  ).sort();

  const normalizedBrands = Array.from(
    new Set(brands.map(normalizeValue).filter((b) => brandCounts[b] > 0))
  ).sort();

  const normalizedSizes = Object.keys(sizeCounts).sort();

  const handleChange = (key, value) => {
    if (typeof setFilters !== "function") return;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="w-full md:w-64 bg-white border border-gray-100 rounded-lg p-5 mb-8 md:mb-0 shadow-sm sticky top-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Filters</h2>

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Price (₹{priceRange[0]} - ₹{priceRange[1]})
        </h3>
        <Slider
          range
          min={minPrice}
          max={maxPrice}
          step={50}
          value={priceRange}
          onChange={(val) => handleChange("price", val)}
          trackStyle={[{ backgroundColor: "#0c831f" }]}
          handleStyle={[
            { borderColor: "#0c831f" },
            { borderColor: "#0c831f" },
          ]}
        />
      </div>

      {/* Selection Type */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Item Type</h3>
        {["Standard", "Organic", "Premium", "Budget"].map((g) => (
          <label key={g} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={gender.includes(g.toLowerCase())}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...gender, g.toLowerCase()]
                  : gender.filter((x) => x !== g.toLowerCase());
                handleChange("gender", newVal);
              }}
              className="mr-2 accent-green-600"
            />
            {g}
          </label>
        ))}
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Category</h3>
        {normalizedCategories.map((c) => (
          <label key={c} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={category.includes(c)}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...category, c]
                  : category.filter((x) => x !== c);
                handleChange("category", newVal);
              }}
              className="mr-2 accent-green-600"
            />
            {c} <span className="text-gray-500">({categoryCounts[c]})</span>
          </label>
        ))}
      </div>

      {/* SubCategory */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Sub Category</h3>
        {normalizedSubCategories.map((sc) => (
          <label key={sc} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={subCategory.includes(sc)}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...subCategory, sc]
                  : subCategory.filter((x) => x !== sc);
                handleChange("subCategory", newVal);
              }}
              className="mr-2 accent-green-600"
            />
            {sc} <span className="text-gray-500">({subCategoryCounts[sc]})</span>
          </label>
        ))}
      </div>

      {/* Size / Weight */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Pack Size</h3>
        {normalizedSizes.map((s) => (
          <label key={s} className="flex items-center mb-2 text-xs">
            <input
              type="checkbox"
              checked={size.includes(s)}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...size, s]
                  : size.filter((x) => x !== s);
                handleChange("size", newVal);
              }}
              className="mr-2 accent-green-600"
            />
            {s} <span className="text-gray-500 ml-1">({sizeCounts[s]})</span>
          </label>
        ))}
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-2">Brand</h3>
        {normalizedBrands.map((b) => (
          <label key={b} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={brand.includes(b)}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...brand, b]
                  : brand.filter((x) => x !== b);
                handleChange("brand", newVal);
              }}
              className="mr-2 accent-green-600"
            />
            {b} <span className="text-gray-500">({brandCounts[b]})</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
