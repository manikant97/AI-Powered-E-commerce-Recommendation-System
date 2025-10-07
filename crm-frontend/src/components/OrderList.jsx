import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fetchOrders, updateOrderStatus } from '../utils/api';
import { STATUS_OPTIONS, STATUS_TABS } from '../constants/orderStatus';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        // Transform data to match the expected format
        const transformedOrders = data.map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.orderDate,
          total: order.total,
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          tax: order.tax || 0,
          paymentMethod: order.paymentMethod === 'creditCard' ? 'Credit Card' : 'PayPal',
          shippingMethod: {
            name: order.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping',
            estimatedDelivery: order.estimatedDelivery
          },
          shippingAddress: {
            name: order.shippingAddress?.fullName || '',
            address: order.shippingAddress?.address || '',
            city: order.shippingAddress?.city || '',
            state: order.shippingAddress?.state || '',
            postalCode: order.shippingAddress?.zipCode || '',
            phone: order.shippingAddress?.phoneNumber || '',
            email: order.user?.email || ''
          },
          items: order.items.map(item => ({
            _id: item._id,
            quantity: item.quantity,
            price: item.price,
            product: {
              _id: item.product?._id || item._id,
              name: item.title,
              price: item.price,
              image: item.image
            }
          }))
        }));
        
        setOrders(transformedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      // Update local state to reflect the change
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      // You might want to show an error toast here
    }
  };

  // Filtered orders
  const filtered = orders.filter(order => {
    const searchTerm = search.toLowerCase();
    const statusLabel = STATUS_OPTIONS.find(s => s.value === order.status)?.label || order.status;
    
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchTerm) ||
      order.items?.some(item => 
        item.product?.name?.toLowerCase().includes(searchTerm)
      ) || false;
      
    const matchesStatus = statusTab === 'All' || statusLabel === statusTab;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Order List</h2>
      {/* Status Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              statusTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Search orders"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Status</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Processed">Processed</option>
          <option value="Returned">Returned</option>
          <option value="Canceled">Canceled</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Category</option>
          <option value="Online">Online</option>
          <option value="In-Store">In-Store</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length > 0 ? (
                  filtered.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.shippingAddress?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${order.total?.toFixed(2) || '0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_OPTIONS.find(s => s.value === order.status)?.color || 'bg-gray-100 text-gray-800'}`}>
                            {order.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className={`px-2 py-1 text-xs font-semibold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              STATUS_OPTIONS.find(s => s.value === order.status)?.color || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option 
                                key={status.value} 
                                value={status.value}
                                className="bg-white text-gray-900"
                              >
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleOrderDetails(order._id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === order._id && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Shipping Information */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h4>
                                <div className="bg-white p-4 rounded-lg shadow-sm space-y-1">
                                  <p className="text-sm font-medium text-gray-900">{order.shippingAddress?.name || 'N/A'}</p>
                                  <p className="text-sm text-gray-600">{order.shippingAddress?.address || 'N/A'}</p>
                                  <p className="text-sm text-gray-600">
                                    {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.postalCode]
                                      .filter(Boolean)
                                      .join(', ')}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Phone:</span> {order.shippingAddress?.phone || 'N/A'}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Email:</span> {order.shippingAddress?.email || 'N/A'}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Order Summary */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Order Summary</h4>
                                <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Subtotal:</span>
                                    <span className="text-sm font-medium">${order.subtotal?.toFixed(2) || '0.00'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Shipping:</span>
                                    <span className="text-sm font-medium">${order.shippingCost?.toFixed(2) || '0.00'}</span>
                                  </div>
                                  {order.tax > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-600">Tax:</span>
                                      <span className="text-sm font-medium">${order.tax?.toFixed(2) || '0.00'}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-sm font-medium text-gray-900">Total:</span>
                                    <span className="text-sm font-bold">${order.total?.toFixed(2) || '0.00'}</span>
                                  </div>
                                  <div className="pt-2 text-sm text-gray-600 space-y-1">
                                    <p className="flex justify-between">
                                      <span className="font-medium">Payment Method:</span>
                                      <span>{order.paymentMethod || 'N/A'}</span>
                                    </p>
                                    <p className="flex justify-between">
                                      <span className="font-medium">Shipping Method:</span>
                                      <span>{order.shippingMethod?.name || 'Standard Shipping'}</span>
                                    </p>
                                    {order.status === 'shipped' && order.shippingMethod?.estimatedDelivery && (
                                      <p className="flex justify-between">
                                        <span className="font-medium">Estimated Delivery:</span>
                                        <span>{formatDate(order.shippingMethod.estimatedDelivery)}</span>
                                      </p>
                                    )}
                                    <p className="flex justify-between">
                                      <span className="font-medium">Order Date:</span>
                                      <span>{formatDate(order.createdAt)}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Order Items */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {order.items?.map((item, index) => (
                                        <tr key={index}>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                              {item.product?.image ? (
                                                <img 
                                                  className="h-10 w-10 rounded-md object-cover mr-3" 
                                                  src={item.product.image} 
                                                  alt={item.product.name} 
                                                />
                                              ) : (
                                                <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                                                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                  </svg>
                                                </div>
                                              )}
                                              <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                  {item.product?.name || 'Product not found'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                  {item.product?.sku || 'N/A'}
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                            ${item.price?.toFixed(2) || '0.00'}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                            {item.quantity || 1}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {search || statusFilter || statusTab !== 'All' 
                          ? 'No orders match your current filters.' 
                          : 'Get started by creating a new order.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList; 