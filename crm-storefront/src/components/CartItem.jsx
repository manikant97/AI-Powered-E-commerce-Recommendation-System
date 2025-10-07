import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // Ensure we have all necessary properties with fallbacks
  const product = {
    id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`,
    title: item.title || item.name || 'Product',
    price: typeof item.price === 'number' ? item.price : 0,
    quantity: typeof item.quantity === 'number' ? item.quantity : 1,
    image: item.image || 'https://via.placeholder.com/150',
    category: item.category || 'General'
  };

  const handleQuantityChange = (newQuantity) => {
    if (typeof onUpdateQuantity === 'function') {
      onUpdateQuantity(product.id, Math.max(1, newQuantity));
    }
  };

  const handleRemove = () => {
    if (typeof onRemove === 'function') {
      onRemove(product.id);
    }
  };

  return (
    <div className="p-4 flex items-center hover:bg-gray-50 border-b">
      <div className="flex-shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-20 h-20 rounded-md object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150';
          }}
        />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500">${product.price.toFixed(2)} each</p>
          </div>
          <p className="text-sm font-medium text-gray-900 mt-2 md:mt-0">
            ${(product.price * product.quantity).toFixed(2)}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <button
              type="button"
              onClick={() => handleQuantityChange(product.quantity - 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-3 py-1 border-x">{product.quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(product.quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-medium text-red-600 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
