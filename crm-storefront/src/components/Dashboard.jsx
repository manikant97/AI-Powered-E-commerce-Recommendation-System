import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Storefront Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to your CRM storefront dashboard. This is where you can manage your storefront operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Products</h3>
              <p className="text-blue-700">Manage your product catalog</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Orders</h3>
              <p className="text-green-700">View and manage customer orders</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Customers</h3>
              <p className="text-purple-700">Manage customer information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 