import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiService } from "../services/api.js";
import ProductCard from "./ProductCard";

const Electronics = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Helper: Decode JWT token safely
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      console.error("Invalid token format");
      localStorage.removeItem("token");
      return null;
    }
  };

  // Helper: Fetch electronics products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.products.getAll({ 
        "x-storefront": "true" 
      });
      setProducts(
        response.data.filter(
          (p) => p.category?.toLowerCase() === "electronics"
        )
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser(decodeToken(token));
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const bestSellers = products.slice(0, 8);
  const newArrivals = products.slice(-8);

  const renderSection = (title, items, isLoading) => (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 col-span-full">
          <p className="text-gray-500">No products found.</p>
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-6xl font-bold mb-4">ELECTRONICS & ACCESSORIES</h2>
          <p className="text-xl mb-8">Discover the latest in technology</p>
          <Link
            to="/"
            className="bg-white text-purple-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderSection("Featured Products", featuredProducts, loading)}
        {renderSection("Best Sellers", bestSellers, loading)}
        {renderSection("New Arrivals", newArrivals, loading)}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Footer columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "ABOUT",
                links: [
                  "Contact Us",
                  "About Us",
                  "Careers",
                  "ShopOnline Stories",
                  "Press",
                ],
              },
              {
                title: "HELP",
                links: ["Payments", "Shipping", "Cancellation & Returns", "FAQ"],
              },
              {
                title: "Consumer Policy",
                links: [
                  "Terms of Use",
                  "Security",
                  "Privacy",
                  "Sitemap",
                  "Grievance Redressal",
                ],
              },
              {
                title: "Let us help You",
                links: [
                  "Your Account",
                  "Return Center",
                  "ShopOnline App Download",
                  "100% Purchase Protection",
                  "Recalls and Product Safety Alert",
                ],
              },
            ].map((col, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300">
              ©2025 ShopOnline. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {["twitter", "facebook", "github"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-300 hover:text-white"
                >
                  <i className={`fab fa-${icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Electronics;
