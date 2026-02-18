

import React, { useState, useEffect } from "react";
import apiClient from '../services/apiClient';
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FaHeart,
  FaShareAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
} from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { user, wishlist, fetchWishlist } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [heartAnimation, setHeartAnimation] = useState(false);

  const [dynamicRating, setDynamicRating] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false); // desktop hover zoom
  const [isFullScreen, setIsFullScreen] = useState(false); // mobile fullscreen zoom
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // detect mobile
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  const isNewArrival = (creationTime) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const creationDate = new Date(creationTime);
    const today = new Date();
    const diffDays = Math.round(Math.abs((today - creationDate) / oneDay));
    return diffDays < 15;
  };

  // Placeholder for reviews (will be generated dynamically)
  const generateReviews = (productId) => {
    const pseudoRandom = (productId.charCodeAt(productId.length - 1) % 10) / 10;
    const rating = (4.2 + (pseudoRandom * 0.7)).toFixed(1);
    const reviews = (100 + (pseudoRandom * 400)).toFixed(0);
    return { rating, reviews };
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(
          `/products/${id}`
        );
        setProduct(response.data);

        if (response.data.variants && response.data.variants.length > 0) {
          const firstAvailableVariant = response.data.variants.find(
            (v) => v.countInStock > 0
          );
          if (firstAvailableVariant) {
            setSelectedVariant(firstAvailableVariant);

            // Generate product-based ratings and reviews
            const ratingInfo = generateReviews(response.data._id);
            setDynamicRating(ratingInfo);
          }
        }
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!user) {
      setIsWishlisted(false);
      return;
    }
    const isInWishlist = wishlist.some((item) => item._id === id);
    setIsWishlisted(isInWishlist);
  }, [id, user, wishlist]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a pack size first.");
      return;
    }
    if (selectedVariant.countInStock <= 0) {
      alert("This pack size is out of stock.");
      return;
    }
    const productToAdd = {
      _id: product._id,
      name: product.name,
      images: product.images,
      selectedVariant: selectedVariant,
    };
    addToCart(productToAdd);
    alert(`${product.name} (${selectedVariant.size}) added to cart!`);
  };

  const isVideo = (url) => {
    const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url.endsWith(ext));
  };

  const nextImage = () => {
    setActiveImageIndex(
      (prevIndex) => (prevIndex + 1) % product.images.length
    );
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  const toggleWishlist = async () => {
    try {
      if (!user) {
        alert("Please login to use wishlist.");
        return;
      }
      if (isWishlisted) {
        await (`/wishlist/${product._id}`);
      } else {
        await apiClient.post(`/wishlist/${product._id}`);
      }
      await fetchWishlist();
      setHeartAnimation(true);
      setTimeout(() => setHeartAnimation(false), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    const link = window.location.href;
    navigator.clipboard
      .writeText(link)
      .then(() => alert("Product link copied to clipboard!"))
      .catch(() => alert("Failed to copy link"));
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!product) return null;

  const productDescriptionParagraphs = product.description
    .split("\n\n")
    .map((p, i) => (
      <p key={i} className="mt-4 first:mt-0 leading-relaxed text-gray-700">
        {p}
      </p>
    ));

  return (
    <div className="container mx-auto px-4 py-4 md:py-16 bg-white font-sans antialiased">
      {/* Full-screen image modal for mobile zoom */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4"
            onClick={() => setIsFullScreen(false)}
          >
            <motion.img
              src={product.images[activeImageIndex]}
              alt={product.name}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main product page layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Image and Video Gallery */}
        <div className="w-full md:w-1/2">
          <div
            className="relative w-full h-[300px] md:h-[500px] bg-gray-50 rounded-2xl shadow-xl overflow-hidden group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
            onClick={() => {
              if (isMobile && !isVideo(product.images[activeImageIndex])) {
                setIsFullScreen(true);
              }
            }}
          >
            {isVideo(product.images[activeImageIndex]) ? (
              <video
                src={product.images[activeImageIndex]}
                controls
                autoPlay
                loop
                muted
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className={`w-full h-full object-contain p-4 transition-transform duration-500 ease-in-out ${isZoomed && !isMobile ? "scale-110" : "scale-100"
                  }`}
              />
            )}

            {/* Desktop zoom toggle */}
            {!isVideo(product.images[activeImageIndex]) && !isMobile && (
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="hidden md:flex absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition z-30"
                aria-label="Toggle zoom"
              >
                {isZoomed ? (
                  <FaSearchMinus className="text-gray-700" />
                ) : (
                  <FaSearchPlus className="text-gray-700" />
                )}
              </button>
            )}

            {/* Zoom lens background (desktop only) */}
            {isZoomed && !isMobile && (
              <div
                className="hidden md:block absolute top-0 left-0 w-full h-full cursor-none z-20"
                style={{
                  backgroundImage: `url(${product.images[activeImageIndex]})`,
                  backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                  backgroundSize: "200%",
                }}
              />
            )}

            {/* Mobile zoom icon */}
            {!isVideo(product.images[activeImageIndex]) && isMobile && (
              <button
                onClick={() => setIsFullScreen(true)}
                className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition z-30"
                aria-label="Full screen zoom"
              >
                <FaSearchPlus className="text-gray-700" />
              </button>
            )}

            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition z-30"
                >
                  <FaChevronLeft className="text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition z-30"
                >
                  <FaChevronRight className="text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail grid */}
          <div className="flex space-x-2 md:space-x-4 mt-4 overflow-x-auto pb-4">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-16 h-16 md:w-24 md:h-24 overflow-hidden rounded-md cursor-pointer border-2 transition-all duration-300 ${activeImageIndex === index
                  ? "border-gray-900 shadow-md"
                  : "border-transparent hover:border-gray-400"
                  }`}
                onClick={() => {
                  setActiveImageIndex(index);
                }}
              >
                {isVideo(img) ? (
                  <video src={img} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="w-full md:w-1/2 flex flex-col p-2 md:p-0">
          <div className="flex items-center justify-between mb-2">
            {isNewArrival(product.createdAt) && (
              <span className="bg-gray-200 text-gray-700 text-xs md:text-sm font-semibold px-3 py-1 rounded-full tracking-wide">
                New Arrival
              </span>
            )}
            <div className="flex space-x-4 ml-auto relative">
              <button
                onClick={toggleWishlist}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaHeart
                  className={`text-2xl transition-transform duration-300 ${isWishlisted
                    ? "text-red-500 scale-110"
                    : "text-gray-400 hover:text-red-400"
                    }`}
                />
                <AnimatePresence>
                  {heartAnimation && (
                    <motion.div
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -40, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 text-red-500"
                    >
                      <FaHeart />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaShareAlt className="text-2xl text-gray-400 hover:text-gray-900" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mt-2">
            {product.name}
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-500">{product.brand}</p>

          {dynamicRating && (
            <div className="flex items-center mt-3">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-4 h-4 md:w-5 md:h-5 ${i < Math.floor(dynamicRating.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              ))}
              <span className="ml-2 text-xs md:text-sm text-gray-500">
                ({dynamicRating.reviews} Reviews)
              </span>
            </div>
          )}

          <p className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
            ₹{selectedVariant ? selectedVariant.price : "N/A"}
          </p>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Select Pack Size:</h4>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => setSelectedVariant(variant)}
                  className={`py-2 md:py-3 rounded-md font-medium text-xs md:text-base transition-all duration-200 border border-gray-300 hover:border-gray-900
                    ${selectedVariant?.size === variant.size
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-800"
                    }
                    ${variant.countInStock <= 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : ""
                    }`}
                  disabled={variant.countInStock <= 0}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 md:pt-8">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Description:</h4>
            <div className="mt-2 text-sm md:text-base text-gray-700 leading-relaxed">
              {productDescriptionParagraphs}
            </div>
          </div>

          <div className="mt-8">
            {selectedVariant && selectedVariant.countInStock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white font-bold py-3 md:py-4 rounded-md text-base md:text-lg hover:bg-gray-800 transition transform shadow-lg"
              >
                Add to Cart
              </button>
            ) : (
              <button
                className="w-full bg-gray-400 text-white font-bold py-3 md:py-4 rounded-md text-base md:text-lg cursor-not-allowed shadow-md"
                disabled
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
