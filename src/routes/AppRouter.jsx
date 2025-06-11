import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Products from "../pages/Products";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import DashboardToko from "../pages/DashboardToko";
import Cart from "../pages/cart";
import Owner from "../pages/Owner";
import OrderHistory from "../pages/OrderHistory";

const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard-toko/:merchantId" element={<DashboardToko />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/owner" element={<Owner />} />
      <Route path="/order-history" element={<OrderHistory />} />

    </Routes>
  </Router>
);

export default AppRouter;