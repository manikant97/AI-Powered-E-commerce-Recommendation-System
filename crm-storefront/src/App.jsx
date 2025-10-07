import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BestSellers from './components/BestSellers';
import Clothing from './components/Clothing';
import Dashboard from './components/Dashboard';
import Electronics from './components/Electronics';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Login from './components/Login';
import NewArrivals from './components/NewArrivals';
import Register from './components/Register';
import { CartProvider } from './context/CartContext';
import { ProfileProvider } from './context/ProfileContext';
import { WishlistProvider } from './context/WishlistContext';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyAccount from './pages/MyAccount';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';
import WishlistPage from './pages/WishlistPage';


// Layout component for pages with header
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">{children}</main>
  </div>
);

// Pages that should include the header
const routesWithHeader = [
  { path: "/", element: <HomePage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/electronics", element: <Electronics /> },
  { path: "/clothing", element: <Clothing /> },
  { path: "/new-arrivals", element: <NewArrivals /> },
  { path: "/best-sellers", element: <BestSellers /> },
  { path: "/search", element: <SearchResults /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/wishlist", element: <WishlistPage /> },
  { path: "/product/:id", element: <ProductDetails /> },
  { path: "/my-account", element: <MyAccount /> },
];

function App() {
  return (
    <ProfileProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              {/* Routes without header */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes with header */}
              {routesWithHeader.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Layout>{route.element}</Layout>}
                />
              ))}
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </ProfileProvider>
  );
}


export default App;














