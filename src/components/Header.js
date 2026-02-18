


// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   HiOutlineMenu,
//   HiOutlineX,
//   HiOutlineShoppingCart,
//   HiOutlineUser,
//   HiOutlineSearch,
// } from "react-icons/hi";

// const Header = () => {
//   const navigate = useNavigate();
//   const user = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("user"));
//     } catch {
//       return null;
//     }
//   })();

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Shrink-on-scroll listener
//   useEffect(() => {
//     const onScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen((s) => !s);
//     if (isSearchVisible) setIsSearchVisible(false);
//   };

//   const toggleSearch = () => {
//     setIsSearchVisible((s) => !s);
//     if (isMenuOpen) setIsMenuOpen(false);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery("");
//       setIsSearchVisible(false);
//       setIsMenuOpen(false);
//     }
//   };

//   const navLinks = [
//     { name: "New Release", path: "/products/recent" },
//     { name: "Best Seller", path: "/products/subcategory/featured" },
//     { name: "Shop", path: "/products" },
//     { name: "Contact", path: "/contact" },
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineHeart,
} from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart(); // Access cartItems from the context

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  // Shrink-on-scroll listener
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate cart on item count change
  useEffect(() => {
    if (cartItems.length > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300); // Remove class after animation
      return () => clearTimeout(timer);
    }
  }, [cartItems.length]); // Dependency on cartItems.length

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen((s) => !s);
    if (isSearchVisible) setIsSearchVisible(false);
  };

  const toggleSearch = () => {
    setIsSearchVisible((s) => !s);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchVisible(false);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "New Release", path: "/products/recent" },
    { name: "Best Seller", path: "/products/subcategory/featured" },
    { name: "Shop", path: "/products" },
    { name: "Contact", path: "/contact" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Blogs", path: "/blog" },
  ];

  const cartCount = cartItems.length;

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? "backdrop-blur-lg bg-white/80 shadow-lg text-gray-800"
        : "bg-white/90 backdrop-blur-md text-gray-800 border-b border-gray-100"
        }`}
      role="banner"
    >
      {/* Promo bar */}
      <div className="bg-green-600 text-white py-1.5 px-2 text-[9px] md:text-xs font-bold tracking-widest uppercase overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap inline-block min-w-full">
          Fresh Organic Vegetables at your doorstep. Get 20% off on your first order! &nbsp;&nbsp;&nbsp;&nbsp; Fresh Organic Vegetables at your doorstep. Get 20% off on your first order!
        </div>
      </div>
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 py-4"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center transition-all duration-300"
          aria-label="Rohtak Grocery Co. Home"
        >
          <img src="./final-logo.png" alt="Rohtak Grocery Co." className="h-[30px] w-[120px] md:h-[50px] md:w-[200px] object-contain mix-blend-multiply" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`font-medium transition-colors duration-200 ${isScrolled ? "text-gray-600 hover:text-blue-800" : "text-gray-600 hover:text-blue-800"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right actions (desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Search (desktop) */}
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-full bg-white/70 backdrop-blur px-3 py-1 border border-transparent focus-within:border-blue-300 transition-all duration-200"
            role="search"
            aria-label="Site search"
          >
            <HiOutlineSearch className="text-gray-500 mr-2" aria-hidden />
            <input
              type="text"
              placeholder="Search groceries"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-40 text-current placeholder-current opacity-80"
              aria-label="Search input"
            />
          </form>

          {/* Auth / Account */}
          {user ? (
            <>
              <Link
                to={
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "delivery"
                      ? "/delivery"
                      : "/myorders"
                }
                className="text-gray-600 hover:text-blue-800 transition-colors"
                aria-label="User dashboard"
                title="My account"
              >
                <HiOutlineUser className="w-6 h-6" />
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-800 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-800 transition-colors font-medium"
              >
                Login
              </Link>
            </>
          )}

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="text-gray-600 hover:text-red-500 transition-colors"
            aria-label="View wishlist"
            title="Wishlist"
          >
            <HiOutlineHeart className="w-6 h-6" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-blue-800 transition-colors"
            aria-label="View cart"
            title="Cart"
          >
            <HiOutlineShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span
                key={cartCount}
                className={`absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center transition-all duration-300 transform origin-center ${animateCart ? "scale-125" : "scale-100"
                  }`}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile icons */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={toggleSearch}
            aria-label="Open search"
            className="text-gray-600 hover:text-blue-800 p-2 rounded-full transition"
          >
            <HiOutlineSearch className="w-5 h-5" />
          </button>

          <Link
            to="/wishlist"
            className="text-gray-600 hover:text-red-500 p-2 rounded-full transition"
            aria-label="Open wishlist"
            title="Wishlist"
          >
            <HiOutlineHeart className="w-5 h-5" />
          </Link>

          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-blue-800 p-2 rounded-full transition"
            aria-label="Open cart"
            title="Cart"
          >
            <HiOutlineShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                key={cartCount}
                className={`absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center transition-all duration-300 transform origin-center ${animateCart ? "scale-125" : "scale-100"
                  }`}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="text-gray-600 hover:text-blue-800 p-2 rounded-full transition"
          >
            {isMenuOpen ? (
              <HiOutlineX className="w-5 h-5" />
            ) : (
              <HiOutlineMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile search area */}
      {isSearchVisible && (
        <div className="md:hidden px-4 pb-3 animate-fadeIn">
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-2 border border-blue-200 shadow-sm"
            role="search"
            aria-label="Mobile search"
          >
            <HiOutlineSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search groceries"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-gray-700 outline-none w-full"
              aria-label="Search input"
            />
          </form>
        </div>
      )}

      {/* Mobile slide-in menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="absolute inset-0 bg-black/30" onClick={toggleMenu} />
        <aside className="relative bg-gradient-to-b from-blue-50 via-gray-50 to-white w-4/5 max-w-xs h-full p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              onClick={toggleMenu}
              className="flex items-center"
            >
              <img src="/logo-image.jpg" alt="Rohtak Grocery Co." className="h-10 w-auto object-contain" />
            </Link>
            <button
              onClick={toggleMenu}
              aria-label="Close menu"
              className="text-gray-700"
            >
              <HiOutlineX className="w-7 h-7" />
            </button>
          </div>

          <nav>
            <ul className="flex flex-col space-y-5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={toggleMenu}
                    className="block text-gray-700 hover:text-blue-800 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              <hr className="my-3 border-t border-gray-100" />

              {user ? (
                <>
                  <li>
                    <Link
                      to={
                        user.role === "admin"
                          ? "/admin"
                          : user.role === "delivery"
                            ? "/delivery"
                            : "/myorders"
                      }
                      onClick={toggleMenu}
                      className="block text-gray-700 hover:text-blue-800 transition-colors"
                    >
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cart"
                      onClick={toggleMenu}
                      className="block text-gray-700 hover:text-blue-800"
                    >
                      Cart
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="text-left text-gray-700 hover:text-blue-800 w-full"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="block text-gray-700 hover:text-blue-800"
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </aside>
      </div>
    </header>
  );
};

export default Header;