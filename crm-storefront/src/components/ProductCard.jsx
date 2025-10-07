import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Use MongoDB _id for navigation and ensure product has a proper ID for cart/wishlist
  const productId = product._id || product.id;
  const productWithId = {
    ...product,
    id: productId || `product-${product.title || product.name}-${Math.random().toString(36).substr(2, 9)}`
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Adding product to cart:', productWithId);
    addToCart(productWithId);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(productWithId.id)) {
      removeFromWishlist(productWithId.id);
    } else {
      addToWishlist(productWithId);
    }
  };

  return (
    <Link to={`/product/${productId}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={
              product.image 
                ? (product.image.startsWith('/uploads') 
                    ? product.image // Use relative path for uploaded images
                    : product.image) // Use URL directly for external images
                : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center'
            }
            alt={product.title || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.log('Image failed to load:', product.image);
              e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center';
            }}
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isInWishlist(productWithId.id) 
                ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            } shadow-md hover:shadow-lg transition-all duration-200`}
            aria-label={isInWishlist(productWithId.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg 
              className="h-5 w-5" 
              fill={isInWishlist(productWithId.id) ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title || product.name}</h3>
          <p className="text-xl font-bold text-blue-600 mb-4">${product.price?.toFixed(2) || '0.00'}</p>
          <div className="mt-auto">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
