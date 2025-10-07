import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { apiService } from '../services/api.js';
import Wishlist from './Wishlist';

const Header = () => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
    return null;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const { profileImage, userName, clearProfile } = useProfile();
  const currentPath = window.location.pathname;

  // Fetch all products for search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.products.getAll({ 
          'x-storefront': 'true' 
        });
        setAllProducts(response.data);
      } catch (error) {
        console.error('Error fetching products for search:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = allProducts.filter(
      product => 
        (product.title && product.title.toLowerCase().includes(term)) ||
        (product.description && product.description.toLowerCase().includes(term)) ||
        (product.category && product.category.toLowerCase().includes(term))
    );

    setSearchResults(results);
    setShowResults(results.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
      setSearchTerm('');
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowResults(false);
    setSearchTerm('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    clearProfile(); // Clear profile data on logout
    navigate('/login');
  };

  const isActive = (path) => {
    return currentPath === path ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">ShopOnline</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/electronics" className={isActive('/electronics')}>Electronics</Link>
            <Link to="/clothing" className={isActive('/clothing')}>Clothing</Link>
            <Link to="/new-arrivals" className={isActive('/new-arrivals')}>New Arrivals</Link>
            <Link to="/best-sellers" className={isActive('/best-sellers')}>Best Sellers</Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative w-64">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => searchTerm.trim() !== '' && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                <button type="submit" className="absolute left-3 top-2.5">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product._id || product.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onMouseDown={() => handleResultClick(product._id || product.id)}
                    >
                      <img
                        src={product.image || 'https://via.placeholder.com/40'}
                        alt={product.title || product.name}
                        className="w-10 h-10 object-cover rounded mr-3"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/40';
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900 truncate">{product.title || product.name}</div>
                        <div className="text-sm text-gray-500">${product.price?.toFixed(2) || '0.00'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showResults && searchResults.length === 0 && searchTerm.trim() !== '' && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 text-gray-500">
                  No products found
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Wishlist />

            {/* Cart */}
            <div className="relative">
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* User Profile */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  {user ? (
                    profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${profileImage ? 'hidden' : 'flex'}`}>
                    {user ? (
                      <span className="text-white text-sm font-semibold">
                        {userName ? userName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {userName || user.email}
                    </div>
                    <Link
                      to="/my-account"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
