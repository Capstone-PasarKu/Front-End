import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { useCart } from "../contexts/CartContext"; // Tambahkan ini

const Cart = () => {
  // Sample cart state (replace with actual cart data source, e.g., context, localStorage, or API)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Beras Premium",
      price: 65000,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
      description: "Dijual oleh Toko Sumber Rejeki - Kategori: Sembako",
      quantity: 2,
    },
    {
      id: 2,
      name: "Minyak Goreng 2L",
      price: 32000,
      image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
      description: "Dijual oleh Toko Makmur Jaya - Kategori: Minyak",
      quantity: 1,
    },
  ]);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity less than 1
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 min-h-screen bg-[#F5F5DC]">
      <h2 className="text-3xl font-extrabold text-[#1C5532] mb-8 text-center drop-shadow">
        Keranjang Belanja
      </h2>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <div className="text-center text-[#1C5532]">
          <p className="text-lg mb-4">Keranjang Anda kosong.</p>
          <Link
            to="/products"
            className="inline-block bg-[#76AB51] text-[#F5F5DC] px-6 py-3 rounded-xl font-medium hover:bg-[#1C5532] transition duration-300 border border-[#76AB51]"
          >
            Lihat Produk
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Cart Items List */}
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg border border-[#76AB51]"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1C5532] mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-[#1C5532] font-semibold text-xl">
                    Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="bg-[#E57B2D] text-[#F5F5DC] px-3 py-1 rounded-lg hover:bg-[#76AB51] transition duration-300 border border-[#E57B2D]"
                    >
                      -
                    </button>
                    <span className="text-[#1C5532] font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="bg-[#E57B2D] text-[#F5F5DC] px-3 py-1 rounded-lg hover:bg-[#76AB51] transition duration-300 border border-[#E57B2D]"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700 transition duration-300"
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">
              Ringkasan Belanja
            </h3>
            <div className="flex justify-between text-[#1C5532] mb-4">
              <span>Total Harga</span>
              <span className="font-semibold text-xl">
                Rp{totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-[#1C5532] text-[#F5F5DC] px-6 py-3 rounded-xl font-medium hover:bg-[#76AB51] transition duration-300 text-center border border-[#1C5532]"
            >
              Lanjutkan ke Pembayaran
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
