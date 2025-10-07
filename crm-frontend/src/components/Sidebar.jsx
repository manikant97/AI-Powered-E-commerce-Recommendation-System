import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ecomOpen, setEcomOpen] = useState(location.pathname.startsWith('/ecommerce'));

  // Get user info from token
  let user = null;
  const token = localStorage.getItem('token');
  if (token) {
    user = decodeToken(token);
  }

  return (
    <div className="fixed left-0 top-0 h-full bg-gray-800 text-gray-100 w-64 p-6 flex flex-col overflow-y-auto border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-md mr-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Ecom CRM</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <Link to="/leads" className={`flex items-center px-4 py-3 text-gray-200 rounded-lg transition-all ${location.pathname === '/leads' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-gray-700 hover:text-white'}`}>
          <span className="text-sm font-medium">🧲 Leads</span>
        </Link>
        <Link to="/ai-center" className={`flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors ${location.pathname === '/ai-center' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
          <span className="text-sm font-medium">🤖 AI Center</span>
        </Link>
        {/* E-commerce collapsible */}
        <div>
          <button
            className={`flex items-center w-full px-4 py-3 text-gray-200 rounded-lg transition-all ${location.pathname.startsWith('/ecommerce') ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-gray-700 hover:text-white'}`}
            onClick={() => setEcomOpen((v) => !v)}
          >
            <span className="text-sm font-medium mr-2">🛒 E-commerce</span>
            <svg className={`w-4 h-4 ml-auto transition-transform ${ecomOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          {ecomOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link to="/ecommerce/dashboard" className={`block px-3 py-2 rounded text-sm transition-colors ${location.pathname === '/ecommerce/dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Dashboard</Link>
              <Link to="/ecommerce/orders" className={`block px-3 py-2 rounded text-sm ${location.pathname === '/ecommerce/orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>Order List</Link>
              <Link to="/ecommerce/products" className={`block px-3 py-2 rounded text-sm ${location.pathname === '/ecommerce/products' ? 'bg-blue-100 text-blue-700' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>Product List</Link>
              <Link to="/ecommerce/add" className={`block px-3 py-2 rounded text-sm ${location.pathname === '/ecommerce/add' ? 'bg-blue-100 text-blue-700' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>Add New Product</Link>
              <Link to="/ecommerce/categories" className={`block px-3 py-2 rounded text-sm ${location.pathname === '/ecommerce/categories' ? 'bg-blue-100 text-blue-700' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>Category Management</Link>
              <Link to="/ecommerce/payment" className={`block px-3 py-2 rounded text-sm ${location.pathname === '/ecommerce/payment' ? 'bg-blue-100 text-blue-700' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>Payment Gateway Setup</Link>
              <Link to="/ecommerce/invoice" className={`block px-3 py-2 rounded text-sm ${location.pathname === '/ecommerce/invoice' ? 'bg-blue-100 text-blue-700' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>Auto-Invoice Settings</Link>
            </div>
          )}
        </div>
        <Link to="/sales-orders" className={`flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors ${location.pathname === '/sales-orders' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
          <span className="text-sm font-medium">📦 Sales & Orders</span>
        </Link>
        <Link to="/support" className={`flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors ${location.pathname === '/support' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
          <span className="text-sm font-medium">🛠️ Support & Tickets</span>
        </Link>
        <Link to="/automation-settings" className={`flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors ${location.pathname === '/automation-settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
          <span className="text-sm font-medium">⚙️ Automation Settings</span>
        </Link>
        <Link to="/dashboard" className={`flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
          <span className="text-sm font-medium">📊 Dashboard</span>
        </Link>
      </nav>

      {/* Logout */}
      {/* User Info */}
      {user && (
        <div className="mb-4 p-3 bg-gray-800 rounded text-gray-200 text-sm">
          <div><b>Name:</b> {user.name || 'N/A'}</div>
          <div><b>Email:</b> {user.email}</div>
        </div>
      )}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="flex items-center w-full px-4 py-3 text-gray-200 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
