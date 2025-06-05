import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import DashboardToko from "./pages/DashboardToko";
import QualityCheck from "./pages/QualityCheck";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";  
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard-toko/:id" element={<DashboardToko />} />
          <Route path="/quality-check" element={<QualityCheck />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          {/* Tambahkan route lainnya sesuai kebutuhan */}
          <Route path="/product/:id" element={<ProductDetail />} />
				{/* Tambah rute lain, misal /order, kalo perlu */}
        </Routes>
         
      </div>
      <Footer />
    </Router>
  );
}

export default App;
