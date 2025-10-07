import React, { useState } from 'react';

const TABS = [
  { id: 'ready', label: 'Ready to Buy', count: 10 },
  { id: 'payment', label: 'Payment Received', count: 5 },
  { id: 'invoice', label: 'Invoice Sent', count: 8 },
  { id: 'admin', label: 'Admin Verified', count: 10 },
  { id: 'dispatched', label: 'Dispatched', count: 8 },
  { id: 'delivered', label: 'Delivered', count: 4 },
  { id: 'feedback', label: 'Feedback Collected', count: 3 },
];

const ORDERS = {
  ready: [
    { id: 'ORD12345', customer: 'Sophia Clark', product: 'Laptop', amount: '$1200', date: '2024-01-15', status: 'Ready to Buy' },
    { id: 'ORD12346', customer: 'Ethan Harris', product: 'Tablet', amount: '$300', date: '2024-01-16', status: 'Ready to Buy' },
    { id: 'ORD12347', customer: 'Olivia Turner', product: 'Smartphone', amount: '$800', date: '2024-01-17', status: 'Ready to Buy' },
    { id: 'ORD12348', customer: 'Liam Foster', product: 'Headphones', amount: '$150', date: '2024-01-18', status: 'Ready to Buy' },
    { id: 'ORD12349', customer: 'Ava Bennett', product: 'Keyboard', amount: '$75', date: '2024-01-19', status: 'Ready to Buy' },
    { id: 'ORD12350', customer: 'Noah Carter', product: 'Mouse', amount: '$25', date: '2024-01-20', status: 'Ready to Buy' },
    { id: 'ORD12351', customer: 'Isabella Reed', product: 'Monitor', amount: '$250', date: '2024-01-21', status: 'Ready to Buy' },
    { id: 'ORD12352', customer: 'Jackson Cole', product: 'Webcam', amount: '$100', date: '2024-01-22', status: 'Ready to Buy' },
    { id: 'ORD12353', customer: 'Mia Hughes', product: 'Microphone', amount: '$50', date: '2024-01-23', status: 'Ready to Buy' },
    { id: 'ORD12354', customer: 'Aiden Cooper', product: 'Speakers', amount: '$100', date: '2024-01-24', status: 'Ready to Buy' },
  ],
  payment: [
    { id: 'ORD12345', customer: 'John Wake', product: 'Laptop', amount: '$1900', date: '2024-01-15', status: 'Payment Received' },
    { id: 'ORD12346', customer: 'Julie Harris', product: 'Monitor', amount: '$300', date: '2024-01-16', status: 'Payment Received' },
    { id: 'ORD12347', customer: 'Olivia Turner', product: 'Smartphone', amount: '$800', date: '2024-01-17', status: 'Payment Received' },
    { id: 'ORD12348', customer: 'Liam Foster', product: 'Headphones', amount: '$150', date: '2024-01-18', status: 'Payment Received' },
    { id: 'ORD12349', customer: 'Neo Bennett', product: 'Keyboard', amount: '$75', date: '2024-01-19', status: 'Payment Received' },
  ],
  invoice: [
    { invoiceNumber: 'INV2024001', recipient: 'Ava Bennett', dateSent: '2024-01-15' },
    { invoiceNumber: 'INV2024002', recipient: 'Sophia Clark', dateSent: '2024-01-16' },
    { invoiceNumber: 'INV2024003', recipient: 'Ethan Harris', dateSent: '2024-01-17' },
    { invoiceNumber: 'INV2024004', recipient: 'Olivia Turner', dateSent: '2024-01-18' },
    { invoiceNumber: 'INV2024005', recipient: 'Liam Foster', dateSent: '2024-01-19' },
    { invoiceNumber: 'INV2024006', recipient: 'Noah Carter', dateSent: '2024-01-20' },
    { invoiceNumber: 'INV2024007', recipient: 'Isabella Reed', dateSent: '2024-01-21' },
    { invoiceNumber: 'INV2024008', recipient: 'Jackson Cole', dateSent: '2024-01-22' },
  ],
  admin: [
    { invoiceNumber: 'INV2024001', recipient: 'Ava Bennett', admin: 'Admin Sarah', dateVerified: '2024-01-16' },
    { invoiceNumber: 'INV2024002', recipient: 'Sophia Clark', admin: 'Admin Mike', dateVerified: '2024-01-17' },
    { invoiceNumber: 'INV2024003', recipient: 'Ethan Harris', admin: 'Admin Sarah', dateVerified: '2024-01-18' },
    { invoiceNumber: 'INV2024004', recipient: 'Olivia Turner', admin: 'Admin Mike', dateVerified: '2024-01-19' },
    { invoiceNumber: 'INV2024005', recipient: 'Liam Foster', admin: 'Admin Sarah', dateVerified: '2024-01-20' },
    { invoiceNumber: 'INV2024006', recipient: 'Noah Carter', admin: 'Admin Mike', dateVerified: '2024-01-21' },
    { invoiceNumber: 'INV2024007', recipient: 'Isabella Reed', admin: 'Admin Sarah', dateVerified: '2024-01-22' },
    { invoiceNumber: 'INV2024008', recipient: 'Jackson Cole', admin: 'Admin Mike', dateVerified: '2024-01-23' },
    { invoiceNumber: 'INV2024009', recipient: 'Mia Hughes', admin: 'Admin Sarah', dateVerified: '2024-01-24' },
    { invoiceNumber: 'INV2024010', recipient: 'Aiden Cooper', admin: 'Admin Mike', dateVerified: '2024-01-25' },
  ],
  dispatched: [
    { invoiceNumber: 'INV2024001', recipient: 'Ava Bennett', dispatchDate: '2024-01-17', carrier: 'Express Delivery', trackingNumber: 'ABC123456789' },
    { invoiceNumber: 'INV2024002', recipient: 'Sophia Clark', dispatchDate: '2024-01-18', carrier: 'Fast Shipping', trackingNumber: 'DEF987654321' },
    { invoiceNumber: 'INV2024003', recipient: 'Ethan Harris', dispatchDate: '2024-01-19', carrier: 'Express Delivery', trackingNumber: 'GHI456789123' },
    { invoiceNumber: 'INV2024004', recipient: 'Olivia Turner', dispatchDate: '2024-01-20', carrier: 'Fast Shipping', trackingNumber: 'JKL789123456' },
    { invoiceNumber: 'INV2024005', recipient: 'Liam Foster', dispatchDate: '2024-01-21', carrier: 'Express Delivery', trackingNumber: 'MNO321654987' },
    { invoiceNumber: 'INV2024006', recipient: 'Noah Carter', dispatchDate: '2024-01-22', carrier: 'Fast Shipping', trackingNumber: 'PQR654321987' },
    { invoiceNumber: 'INV2024007', recipient: 'Isabella Reed', dispatchDate: '2024-01-23', carrier: 'Express Delivery', trackingNumber: 'STU987321654' },
    { invoiceNumber: 'INV2024008', recipient: 'Jackson Cole', dispatchDate: '2024-01-24', carrier: 'Fast Shipping', trackingNumber: 'VWX321987654' },
  ],
  delivered: [
    { invoiceNumber: 'INV2024009', recipient: 'Ava Bennett', deliveryDateTime: '2024-01-26 10:00 AM', carrier: 'Express Delivery', trackingNumber: 'CVBMAX123456789' },
    { invoiceNumber: 'INV2024010', recipient: 'Sophia Clark', deliveryDateTime: '2024-01-27 02:30 PM', carrier: 'Fast Shipping', trackingNumber: 'CVBMAX987654321' },
    { invoiceNumber: 'INV2024011', recipient: 'Ethan Harris', deliveryDateTime: '2024-01-28 09:15 AM', carrier: 'Express Delivery', trackingNumber: 'CVBMAX456789123' },
    { invoiceNumber: 'INV2024012', recipient: 'Olivia Turner', deliveryDateTime: '2024-01-29 04:45 PM', carrier: 'Fast Shipping', trackingNumber: 'CVBMAX789123456' },
  ],
  feedback: [
    { customer: 'Sophia Carter', date: 'July 15, 2024', rating: 5, review: 'Excellent service and fast delivery. The product exceeded my expectations. Will definitely order again.', likes: 3, dislikes: 0 },
    { customer: 'Emily Clark', date: 'July 14, 2024', rating: 5, review: 'Great quality products and amazing customer support. Highly recommended!', likes: 2, dislikes: 0 },
    { customer: 'Olivia Bennett', date: 'July 13, 2024', rating: 5, review: 'Fast shipping and excellent packaging. The product quality is outstanding.', likes: 1, dislikes: 0 },
  ],
};

const statusClass = (status) => {
  if (status === 'Ready to Buy') return 'bg-gray-100 text-gray-800';
  if (status === 'Payment Received') return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
};

const SalesOrders = () => {
  const [activeTab, setActiveTab] = useState('ready');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sales and Orders</h1>
      <div className="flex space-x-6 border-b border-gray-200 mb-4">
        {TABS.map((tab) => (
            <button 
            key={tab.id}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
            </button>
        ))}
            </div>
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'feedback' ? (
          // Feedback Section
          <div className="space-y-6">
            {ORDERS.feedback.map((feedback, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{feedback.customer}</h3>
                    <p className="text-sm text-gray-500">{feedback.date}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{feedback.review}</p>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{feedback.likes}</span>
                            </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{feedback.dislikes}</span>
                            </button>
                </div>
              </div>
            ))}
            <div className="text-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Load More
              </button>
            </div>
          </div>
        ) : (
          // Table Section for other tabs
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                  {activeTab === 'ready' || activeTab === 'payment' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  ) : activeTab === 'invoice' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Sent</th>
                    </>
                  ) : activeTab === 'admin' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Verified</th>
                    </>
                  ) : activeTab === 'dispatched' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispatch Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Number</th>
                    </>
                  ) : activeTab === 'delivered' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Number</th>
                    </>
                  ) : null}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {(ORDERS[activeTab] || []).map((order, index) => (
                  <tr key={index}>
                    {activeTab === 'ready' || activeTab === 'payment' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">{order.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                      </>
                    ) : activeTab === 'invoice' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.invoiceNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.recipient}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.dateSent}</td>
                      </>
                    ) : activeTab === 'admin' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.invoiceNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.recipient}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.admin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.dateVerified}</td>
                      </>
                    ) : activeTab === 'dispatched' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.invoiceNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.recipient}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.dispatchDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.carrier}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.trackingNumber}</td>
                      </>
                    ) : activeTab === 'delivered' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.invoiceNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.recipient}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.deliveryDateTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.carrier}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.trackingNumber}</td>
                      </>
                    ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

export default SalesOrders;
