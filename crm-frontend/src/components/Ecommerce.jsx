import {
    ArrowPathIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AutoInvoiceSettings from './AutoInvoiceSettings';
import OrderList from './OrderList';
import PaymentGatewaySetup from './PaymentGatewaySetup';
import ProductForm from './ProductForm';

// Product List Component
const ProductList = ({ products, onEdit, onDelete, onView, onReset, categories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    // Default: featured first, then by name
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.title.localeCompare(b.title);
  });



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <option key={index} value={cat.name.toLowerCase().replace(/\s+/g, '-')}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No categories available</option>
            )}
          </select>
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setSortBy('featured');
              if (onReset) onReset();
            }}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onView(product)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={
                          product.image
                            ? product.image
                            : 'https://picsum.photos/150'
                        }
                        alt={product.title}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">${(parseFloat(product.price)||0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.featured ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button onClick={e => { e.stopPropagation(); onEdit(product); }} className="p-1.5 text-gray-400 hover:text-indigo-600 focus:outline-none">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); onDelete(product._id); }} className="p-1.5 text-gray-400 hover:text-red-600 focus:outline-none">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

      </div>
    </div>
  );
};

// Category Management Component (beginner-friendly, local state only)
const CategoryManagement = ({ categories, setCategories }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) return;
    if (editIndex !== null) {
      const updated = [...categories];
      updated[editIndex] = { name, description };
      setCategories(updated);
      setEditIndex(null);
    } else {
      setCategories([...categories, { name, description }]);
    }
    setName('');
    setDescription('');
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setName(categories[idx].name);
    setDescription(categories[idx].description);
  };

  const handleDelete = (idx) => {
    if (window.confirm('Delete this category?')) {
      setCategories(categories.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:p-6">
      <h3 className="text-2xl font-bold mb-2">Category Management</h3>
      <h4 className="text-lg font-semibold mb-2">Add New Category</h4>
      <form onSubmit={handleSave} className="mb-6">
        <input
          className="block w-full border rounded px-3 py-2 mb-2"
          placeholder="Enter category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <textarea
          className="block w-full border rounded px-3 py-2 mb-2"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {editIndex !== null ? 'Update Category' : 'Save Category'}
        </button>
        {editIndex !== null && (
          <button type="button" className="ml-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setEditIndex(null); setName(''); setDescription(''); }}>
            Cancel
          </button>
        )}
      </form>
      <h4 className="text-lg font-semibold mb-2">Existing Categories</h4>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((cat, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2">{cat.name}</td>
              <td className="px-4 py-2">{cat.description}</td>
              <td className="px-4 py-2">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(idx)}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(idx)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// E-commerce Dashboard Component
const EcommerceDashboard = ({ products, onEdit, onDelete, onView, onReset }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">E-Commerce Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <div className="text-gray-500 text-sm mb-1">Revenue</div>
          <div className="text-2xl font-bold">$21,456</div>
          <div className="text-green-500 text-xs mt-1">+20% from last month</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <div className="text-gray-500 text-sm mb-1">Sales</div>
          <div className="text-2xl font-bold">12,345</div>
          <div className="text-red-500 text-xs mt-1">-10% from last month</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <div className="text-gray-500 text-sm mb-1">New Customers</div>
          <div className="text-2xl font-bold">2,345</div>
          <div className="text-green-500 text-xs mt-1">+30% from last month</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <div className="text-gray-500 text-sm mb-1">Average Order Value</div>
          <div className="text-2xl font-bold">$53.56</div>
          <div className="text-red-500 text-xs mt-1">-12% from last month</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-2">Revenue</div>
          <div className="text-2xl font-bold">$12,500</div>
          <div className="text-green-500 text-xs mb-2">Last 30 Days +10%</div>
          <div className="h-24 flex items-end">
            {/* Placeholder for chart */}
            <svg width="100%" height="100%" viewBox="0 0 200 60"><polyline fill="none" stroke="#6366f1" strokeWidth="3" points="0,40 20,30 40,35 60,20 80,30 100,10 120,25 140,15 160,30 180,20 200,40" /></svg>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-2">Returning Rate</div>
          <div className="text-2xl font-bold">15%</div>
          <div className="text-green-500 text-xs mb-2">Last 30 Days +5%</div>
          <div className="h-24 flex items-end gap-2">
            {/* Placeholder for bar chart */}
            {[40, 45, 50, 45, 40].map((h, i) => (
              <div key={i} className="bg-indigo-200 w-6" style={{height: `${h}px`}}></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-bold mb-2">Sales by Location</div>
          <div className="text-xs text-gray-400 mb-2">Income in last 28 days</div>
          <div className="mb-2">Canada <span className="float-right">80%</span></div>
          <div className="w-full h-2 bg-gray-200 rounded mb-2"><div className="h-2 bg-blue-500 rounded" style={{width: '80%'}}></div></div>
          <div className="mb-2">United States <span className="float-right">10%</span></div>
          <div className="w-full h-2 bg-gray-200 rounded mb-2"><div className="h-2 bg-blue-500 rounded" style={{width: '10%'}}></div></div>
          <div className="mb-2">United Kingdom <span className="float-right">5%</span></div>
          <div className="w-full h-2 bg-gray-200 rounded mb-2"><div className="h-2 bg-blue-500 rounded" style={{width: '5%'}}></div></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-bold mb-2">Customer Reviews</div>
          <div className="text-xs text-gray-400 mb-2">Based on 5,500 verified purchases</div>
          <div className="flex items-center mb-2">
            <span className="text-3xl font-bold mr-2">4.5</span>
            <span className="text-yellow-400 text-xl">★</span>
            <span className="ml-2 text-gray-500">1,234 reviews</span>
          </div>
          <div className="space-y-1">
            {[{star: 5, pct: 40}, {star: 4, pct: 30}, {star: 3, pct: 15}, {star: 2, pct: 10}, {star: 1, pct: 5}].map(r => (
              <div key={r.star} className="flex items-center text-xs">
                <span className="w-6">{r.star}</span>
                <div className="flex-1 mx-2 h-2 bg-gray-200 rounded"><div className="h-2 bg-yellow-400 rounded" style={{width: `${r.pct}%`}}></div></div>
                <span>{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Product List Table (reuse ProductList) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Product List</h3>
        <ProductList
          products={products}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onReset={onReset}
        />
      </div>
    </div>
  );
};

// Main Ecommerce Component
const Ecommerce = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([
    { name: 'Electronics', description: 'Electronic gadgets and devices.' },
    { name: 'Clothing', description: 'Apparel and clothing items.' },
    { name: 'Home & Garden', description: 'Home appliances and garden tools.' },
    { name: 'Beauty', description: 'Beauty and personal care products.' },
  ]);

  useEffect(() => {
    console.log('Fetching products...');
    api.get('/products')
      .then(res => {
        console.log('Products fetched successfully:', res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        console.error('Error response:', err.response?.data);
      });
  }, []);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    window.history.pushState({}, '', '/ecommerce/add');
  };

  const handleSaveProduct = (product, isMultipart) => {
    if (editingProduct) {
      api.put(`/products/${editingProduct._id}`, product)
        .then(res => {
          setProducts(products.map(p => p._id === editingProduct._id ? res.data : p));
          setEditingProduct(null);
          setSelectedProduct(null);
          window.history.pushState({}, '', '/ecommerce/products');
        })
        .catch(err => console.error(err));
    } else {
      if (isMultipart) {
        api.post('/products', product, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(res => {
            setProducts([...products, res.data]);
            setEditingProduct(null);
            setSelectedProduct(null);
            window.history.pushState({}, '', '/ecommerce/products');
          })
          .catch(err => console.error(err));
      } else {
        api.post('/products', product)
          .then(res => {
            setProducts([...products, res.data]);
            setEditingProduct(null);
            setSelectedProduct(null);
            window.history.pushState({}, '', '/ecommerce/products');
          })
          .catch(err => console.error(err));
      }
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      api.delete(`/products/${id}`)
        .then(() => {
          setProducts(products.filter(p => p._id !== id));
        })
        .catch(err => console.error(err));
    }
  };

  // Routing logic
  let content = null;
  if (location.pathname === '/ecommerce/orders') {
    content = <OrderList />;
  } else if (location.pathname === '/ecommerce/dashboard') {
    content = (
      <EcommerceDashboard
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onView={setSelectedProduct}
        onReset={() => setSelectedProduct(null)}
      />
    );
  } else if (location.pathname === '/ecommerce/products') {
    content = (
      <ProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onView={setSelectedProduct}
        onReset={() => setSelectedProduct(null)}
        categories={categories}
      />
    );
  } else if (location.pathname === '/ecommerce/add') {
    content = (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Product</h3>
        <ProductForm onSave={handleSaveProduct} initialData={editingProduct} categories={categories} />
      </div>
    );
  } else if (location.pathname === '/ecommerce/categories') {
    content = <CategoryManagement categories={categories} setCategories={setCategories} />;
  } else if (location.pathname === '/ecommerce/payment') {
    content = <PaymentGatewaySetup />;
  } else if (location.pathname === '/ecommerce/invoice') {
    content = <AutoInvoiceSettings />;
  } else {
    // Default: show product list
    content = (
      <ProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onView={setSelectedProduct}
        onReset={() => setSelectedProduct(null)}
        categories={categories}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">E-commerce Manager</h1>
      </div>
      <div className="py-4">{content}</div>
    </div>
  );
};

export default Ecommerce;
