import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AICenter from './components/AICenter';
import AutomationSettings from './components/AutomationSettings';
import Dashboard from './components/Dashboard';
import Ecommerce from './components/Ecommerce';
import Layout from './components/Layout';
import Leads from './components/Leads';
import Login from './components/Login';
import Register from './components/Register';
import SalesOrders from './components/SalesOrders';
import Support from './components/Support';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="ai-center" element={<AICenter />} />
          <Route path="ecommerce">
            <Route index element={<Ecommerce />} />
            <Route path="dashboard" element={<Ecommerce />} />
            <Route path="orders" element={<Ecommerce />} />
            <Route path="products" element={<Ecommerce />} />
            <Route path="add" element={<Ecommerce />} />
            <Route path="categories" element={<Ecommerce />} />
            <Route path="payment" element={<Ecommerce />} />
            <Route path="invoice" element={<Ecommerce />} />
          </Route>
          <Route path="sales-orders" element={<SalesOrders />} />
          <Route path="support" element={<Support />} />
          <Route path="automation-settings" element={<AutomationSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
