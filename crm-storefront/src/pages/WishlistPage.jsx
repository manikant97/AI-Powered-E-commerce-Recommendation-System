import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items in wishlist</h3>
          <p className="mt-1 text-sm text-gray-500">Start adding some products to your wishlist!</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {wishlist.map((product) => (
              <li key={product.id} className="flex py-6 px-4 sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.title || product.name}
                    className="w-24 h-24 rounded-md object-cover object-center sm:w-32 sm:h-32"
                  />
                </div>

                <div className="ml-6 flex-1 flex flex-col">
                  <div className="flex">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {product.title || product.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        ${product.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="font-medium text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex items-end justify-between mt-4">
                    <Link
                      to={`/product/${product.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
