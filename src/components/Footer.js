import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import RohtakLogo from '../assets/a.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About Section */}
          <div className="space-y-4">
            <Link to="/">
              <img src={RohtakLogo} alt="Rohtak Grocery Co. Logo" className="w-32 h-auto" />
            </Link>
            <p className="text-sm">
              Rohtak Grocery Co. is dedicated to providing fresh, high-quality groceries that bring health and joy to every home.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Stay Connected</h3>
            <p className="text-sm">Subscribe to our newsletter for exclusive updates and offers.</p>
            <form className="mt-4 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow rounded-l-md p-2 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-gray-700 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Rohtak Grocery Co. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;