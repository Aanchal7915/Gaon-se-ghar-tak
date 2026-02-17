import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

const WishlistPage = () => {
  const { wishlist, fetchWishlist } = useAuth();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-400 mb-6">Your wishlist is empty 💔</h2>
        <a
          href="/products"
          className="bg-green-600 text-white px-10 py-4 rounded-full hover:bg-green-700 transition-all font-bold shadow-lg transform hover:scale-105"
        >
          START SHOPPING
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <div className="flex flex-col mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          My Wishlist ❤️
        </h1>
        <div className="h-1.5 w-20 bg-green-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
