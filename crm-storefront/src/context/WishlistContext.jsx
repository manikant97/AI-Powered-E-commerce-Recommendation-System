import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (product) => {
    setWishlist(prevWishlist => {
      // Make sure the product has a valid ID
      if (!product || !product.id) {
        console.error('Cannot add product to wishlist: Invalid product ID', product);
        return prevWishlist;
      }
      
      console.log('Adding to wishlist:', product);
      
      // Check if product is already in wishlist
      const existingItem = prevWishlist.find(item => item.id === product.id);
      if (existingItem) {
        return prevWishlist; // Already in wishlist, do nothing
      }
      return [...prevWishlist, { ...product }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider 
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
