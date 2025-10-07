import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/api.js';
import ProductCard from './ProductCard';


const BestSellers = () => {
 const [user, setUser] = useState(null);
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const { addToCart } = useCart();


 useEffect(() => {
   // Check if user is logged in
   const token = localStorage.getItem('token');
   if (token) {
     try {
       const payload = JSON.parse(atob(token.split('.')[1]));
       setUser(payload);
     } catch (error) {
       console.error('Error decoding token:', error);
       localStorage.removeItem('token');
     }
   }


   // Fetch products from backend
   const fetchProducts = async () => {
     try {
       setLoading(true);
       const response = await apiService.products.getAll({ 
         'x-storefront': 'true' 
       });
       console.log('Fetched products:', response.data);
      
       // For best sellers, we'll show all products
       setProducts(response.data);
     } catch (error) {
       console.error('Error fetching products:', error);
       setProducts([]);
     } finally {
       setLoading(false);
     }
   };


   fetchProducts();
 }, []);


 const handleLogout = () => {
   localStorage.removeItem('token');
   setUser(null);
 };


  // Using the shared ProductCard component for consistent functionality


  return (
    <div className="min-h-screen bg-gray-50">


     {/* Main Banner */}
     <div className="bg-gradient-to-r from-yellow-100 to-orange-100 py-16">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <h2 className="text-5xl font-bold text-yellow-600 mb-4">Best Sellers</h2>
         <p className="text-xl text-gray-700 mb-8">Our most popular products</p>
       </div>
     </div>


     {/* Product Sections */}
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       {/* Best Sellers */}
       <section className="mb-16">
         <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Best Sellers</h2>
         {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
               <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                 <div className="aspect-square bg-gray-200"></div>
                 <div className="p-4">
                   <div className="h-4 bg-gray-200 rounded mb-2"></div>
                   <div className="h-6 bg-gray-200 rounded mb-3"></div>
                   <div className="h-8 bg-gray-200 rounded"></div>
                 </div>
               </div>
             ))}
           </div>
         ) : products.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {products.map(product => (
               <ProductCard key={product._id || product.id} product={product} />
             ))}
           </div>
         ) : (
           <div className="text-center py-8">
             <p className="text-gray-500">No products available</p>
           </div>
         )}
       </section>
     </div>


     {/* Footer */}
     <footer className="bg-gray-800 text-white">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {/* About */}
           <div>
             <h3 className="text-lg font-semibold mb-4">ABOUT</h3>
             <ul className="space-y-2">
               <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">ShopOnline Stories</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Press</a></li>
             </ul>
           </div>


           {/* Help */}
           <div>
             <h3 className="text-lg font-semibold mb-4">HELP</h3>
             <ul className="space-y-2">
               <li><a href="#" className="text-gray-300 hover:text-white">Payments</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Shipping</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Cancellation & Returns</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
             </ul>
           </div>


           {/* Consumer Policy */}
           <div>
             <h3 className="text-lg font-semibold mb-4">Consumer Policy</h3>
             <ul className="space-y-2">
               <li><a href="#" className="text-gray-300 hover:text-white">Terms of Use</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Security</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Privacy</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Sitemap</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Grievance Redressal</a></li>
             </ul>
           </div>


           {/* Let us help You */}
           <div>
             <h3 className="text-lg font-semibold mb-4">Let us help You</h3>
             <ul className="space-y-2">
               <li><a href="#" className="text-gray-300 hover:text-white">Your Account</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Return Center</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">ShopOnline App Download</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">100% Purchase Protection</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Recalls and Product Safety Alert</a></li>
             </ul>
           </div>
         </div>


         {/* Bottom line */}
         <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
           <p className="text-gray-300">©2025 ShopOnline. All rights reserved.</p>
           <div className="flex space-x-4 mt-4 md:mt-0">
             <a href="#" className="text-gray-300 hover:text-white">
               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
               </svg>
             </a>
             <a href="#" className="text-gray-300 hover:text-white">
               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
               </svg>
             </a>
             <a href="#" className="text-gray-300 hover:text-white">
               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.901 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.901-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.65-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.065-.36 2.235-.421C8.35 2.175 8.73 2.16 11.97 2.16h.03zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
               </svg>
             </a>
           </div>
         </div>
       </div>
     </footer>
   </div>
 );
};


export default BestSellers;



