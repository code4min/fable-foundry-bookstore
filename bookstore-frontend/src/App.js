// src/App.js
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BookDetail from './components/BookDetail';
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import Profile from './components/Profile'; 
import About from './components/About';

import AdminDashboard from './components/AdminDashboard';
import AdminBooks from "./components/admin/AdminBooks";
import AdminCategories from "./components/admin/AdminCategories";
import AdminOrders from "./components/admin/AdminOrders";
import AdminUsers from "./components/admin/AdminUsers";
import AdminReports from "./components/admin/AdminReports";

import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';





function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute requiredRole="USER" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Route>

      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<AdminBooks />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>
      
      <Route path="/unauthorized" element={<Unauthorized />} />
      
    </Routes>
  );
}

export default App;
