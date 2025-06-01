import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiUser } from "react-icons/fi";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [merchantId, setMerchantId] = useState(null);

  // Listen to storage event for login/logout from other tabs
  useEffect(() => {
    const handler = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (!token) {
        setMerchantId(null);
        window.location.reload();
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Listen to custom event for logout
  useEffect(() => {
    const handleLogout = () => {
      setIsLoggedIn(false);
      setMerchantId(null);
      window.location.reload();
    };
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  useEffect(() => {
    // Cek merchantId milik user
    const fetchMerchant = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch(
            "https://pasarku-backend.vercel.app/api/merchants?owned=true",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) setMerchantId(data[0].id);
          }
        } catch {}
      }
    };
    fetchMerchant();
  }, []);

  const isActive = (path) => location.pathname === path;

  // Base navigation links
  const baseLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // Links for logged in users
  const loggedInLinks = [
    ...baseLinks,
    { to: "/quality-check", label: "Cek Kualitas" },
  ];

  // Links for non-logged in users
  const nonLoggedInLinks = [
    ...baseLinks,
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register", special: true },
  ];

  // Use appropriate links based on login status
  const navLinks = isLoggedIn ? loggedInLinks : nonLoggedInLinks;

  return (
    <nav className="bg-[#76AB51] shadow-lg px-4 py-3 md:py-4 text-[#1C5532] sticky top-0 z-50 transition-all">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <img
            src="/src/assets/logo.jpeg"
            alt="Logo Pasarku"
            className="w-10 h-10 rounded-full bg-white object-cover border-2 border-[#76AB51] shadow group-hover:scale-105 transition"
          />
          <span className="text-2xl font-extrabold tracking-tight group-hover:text-[#1C5532] transition">
            Pasarku
          </span>
        </Link>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 font-medium transition border
                ${
                  isActive(link.to)
                    ? "bg-[#1C5532] text-[#F5F5DC] border-[#1C5532] rounded-xl"
                    : "bg-[#76AB51] text-[#1C5532] border-[#76AB51] hover:bg-[#1C5532] hover:text-[#F5F5DC] rounded-lg"
                }
              `}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && merchantId && (
            <Link
              to={`/dashboard-toko/${merchantId}`}
              className={`px-4 py-2 font-medium transition border ml-2
              ${
                isActive(`/dashboard-toko/${merchantId}`)
                  ? "bg-[#1C5532] text-[#F5F5DC] border-[#1C5532] rounded-xl"
                  : "bg-[#76AB51] text-[#1C5532] border-[#76AB51] hover:bg-[#1C5532] hover:text-[#F5F5DC] rounded-lg"
              }
            `}
            >
              Dashboard Toko
            </Link>
          )}
          {isLoggedIn && (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                to="/profile"
                className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#1C5532] text-[#F5F5DC] hover:bg-[#14532d] transition border-2 border-[#1C5532] shadow-lg"
                title="Profil"
              >
                <FiUser className="w-6 h-6" />
              </Link>
            </div>
          )}
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center px-2 py-1 rounded-lg hover:bg-[#1C5532] hover:text-[#F5F5DC] transition"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col space-y-1 bg-[#76AB51] rounded-lg shadow-lg px-4 py-3 animate-fade-in-down">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`w-full text-center px-4 py-2 font-medium transition border
                ${
                  isActive(link.to)
                    ? "bg-[#1C5532] text-[#F5F5DC] border-[#1C5532] rounded-xl"
                    : "bg-[#76AB51] text-[#1C5532] border-[#76AB51] hover:bg-[#1C5532] hover:text-[#F5F5DC] rounded-lg"
                }
              `}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={`w-full text-center px-4 py-2 font-medium transition border bg-[#76AB51] text-[#1C5532] border-[#76AB51] hover:bg-[#1C5532] hover:text-[#F5F5DC] rounded-lg`}
              >
                Profil
              </Link>
              {merchantId && (
                <Link
                  to={`/dashboard-toko/${merchantId}`}
                  onClick={() => setMenuOpen(false)}
                  className={`w-full text-center px-4 py-2 font-medium transition border bg-[#76AB51] text-[#1C5532] border-[#76AB51] hover:bg-[#1C5532] hover:text-[#F5F5DC] rounded-lg`}
                >
                  Dashboard Toko
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
