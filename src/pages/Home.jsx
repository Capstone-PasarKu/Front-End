import React from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiMapPin,
  FiSearch,
  FiTruck,
  FiShield,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Hero Section */}
      <section className="bg-[#F5F5DC] py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            <div className="md:w-1/3 flex justify-center">
              <img
                src="/src/assets/logo_tp.png"
                alt="Logo Pasarku"
                className="w-45 h-40"
              />
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1C5532] mb-4">
                Welcome to Pasarku
              </h1>
              <p className="text-xl text-[#1C5532] mb-8 max-w-2xl">
                Temukan berbagai produk berkualitas dari pedagang lokal
                terpercaya
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-[#E57B2D] text-[#F5F5DC] px-8 py-3 rounded-xl font-medium hover:bg-[#76AB51] hover:text-[#F5F5DC] transition duration-300 flex items-center justify-center gap-2 ring-2 ring-[#E57B2D] focus:outline-none focus:ring-4 focus:ring-[#E57B2D]/40"
                >
                  <FiShoppingBag className="text-xl" />
                  Order Now
                </Link>
                <Link
                  to="/about"
                  className="bg-[#FFFFFF] text-[#E57B2D] px-8 py-3 rounded-xl font-medium hover:bg-[#76AB51] hover:text-[#F5F5DC] transition duration-300 flex items-center justify-center gap-2 ring-2 ring-[#E57B2D] focus:outline-none focus:ring-4 focus:ring-[#E57B2D]/40"
                >
                  Tentang Kami
                  <FiArrowRight className="text-xl" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-[#F5F5DC]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {" "}
            {/* Diperpanjang dari max-w-2xl */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full px-6 py-4 rounded-xl border-2 border-[#76AB51] focus:outline-none focus:border-[#1C5532] text-[#1C5532] bg-white"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1C5532] text-[#F5F5DC] p-3 rounded-lg hover:bg-[#76AB51] transition duration-300">
                <FiSearch className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-[#F5F5DC]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1C5532] mb-8 text-center">
            Produk Unggulan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contoh 6 produk dengan detail */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                alt="Beras Premium"
                className="w-28 h-28 object-cover rounded-lg mb-3 border"
              />
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-1">Sembako</span>
              <h3 className="text-lg font-bold text-green-800 mb-1 text-center">Beras Premium</h3>
              <p className="text-xs text-gray-500 mb-1">Toko Sumber Rejeki</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-1">★★★★★</span>
                <span className="text-xs text-gray-500 ml-1">(120)</span>
              </div>
              <p className="text-green-700 font-semibold text-lg mb-3">Rp65.000</p>
              <button className="bg-[#76AB51] text-white px-4 py-2 rounded shadow hover:bg-[#E57B2D] transition-colors flex items-center gap-2">
                <FiShoppingBag /> Keranjang
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80"
                alt="Minyak Goreng"
                className="w-28 h-28 object-cover rounded-lg mb-3 border"
              />
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded mb-1">Minyak</span>
              <h3 className="text-lg font-bold text-green-800 mb-1 text-center">Minyak Goreng 2L</h3>
              <p className="text-xs text-gray-500 mb-1">Toko Makmur Jaya</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-1">★★★★☆</span>
                <span className="text-xs text-gray-500 ml-1">(98)</span>
              </div>
              <p className="text-green-700 font-semibold text-lg mb-3">Rp32.000</p>
              <button className="bg-[#76AB51] text-white px-4 py-2 rounded shadow hover:bg-[#E57B2D] transition-colors flex items-center gap-2">
                <FiShoppingBag /> Keranjang
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80"
                alt="Telur Ayam"
                className="w-28 h-28 object-cover rounded-lg mb-3 border"
              />
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mb-1">Telur</span>
              <h3 className="text-lg font-bold text-green-800 mb-1 text-center">Telur Ayam 1kg</h3>
              <p className="text-xs text-gray-500 mb-1">Toko Ayam Segar</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-1">★★★★★</span>
                <span className="text-xs text-gray-500 ml-1">(75)</span>
              </div>
              <p className="text-green-700 font-semibold text-lg mb-3">Rp27.000</p>
              <button className="bg-[#76AB51] text-white px-4 py-2 rounded shadow hover:bg-[#E57B2D] transition-colors flex items-center gap-2">
                <FiShoppingBag /> Keranjang
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
                alt="Gula Pasir"
                className="w-28 h-28 object-cover rounded-lg mb-3 border"
              />
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded mb-1">Gula</span>
              <h3 className="text-lg font-bold text-green-800 mb-1 text-center">Gula Pasir 1kg</h3>
              <p className="text-xs text-gray-500 mb-1">Toko Manis Jaya</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-1">★★★★☆</span>
                <span className="text-xs text-gray-500 ml-1">(60)</span>
              </div>
              <p className="text-green-700 font-semibold text-lg mb-3">Rp14.000</p>
              <button className="bg-[#76AB51] text-white px-4 py-2 rounded shadow hover:bg-[#E57B2D] transition-colors flex items-center gap-2">
                <FiShoppingBag /> Keranjang
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                alt="Kopi Bubuk"
                className="w-28 h-28 object-cover rounded-lg mb-3 border"
              />
              <span className="text-xs bg-brown-100 text-brown-700 px-2 py-1 rounded mb-1">Kopi</span>
              <h3 className="text-lg font-bold text-green-800 mb-1 text-center">Kopi Bubuk 200gr</h3>
              <p className="text-xs text-gray-500 mb-1">Toko Kopi Nusantara</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-1">★★★★★</span>
                <span className="text-xs text-gray-500 ml-1">(44)</span>
              </div>
              <p className="text-green-700 font-semibold text-lg mb-3">Rp18.000</p>
              <button className="bg-[#76AB51] text-white px-4 py-2 rounded shadow hover:bg-[#E57B2D] transition-colors flex items-center gap-2">
                <FiShoppingBag /> Keranjang
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80"
                alt="Susu UHT"
                className="w-28 h-28 object-cover rounded-lg mb-3 border"
              />
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mb-1">Susu</span>
              <h3 className="text-lg font-bold text-green-800 mb-1 text-center">Susu UHT 1L</h3>
              <p className="text-xs text-gray-500 mb-1">Toko Susu Segar</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-1">★★★★☆</span>
                <span className="text-xs text-gray-500 ml-1">(38)</span>
              </div>
              <p className="text-green-700 font-semibold text-lg mb-3">Rp17.000</p>
              <button className="bg-[#76AB51] text-white px-4 py-2 rounded shadow hover:bg-[#E57B2D] transition-colors flex items-center gap-2">
                <FiShoppingBag /> Keranjang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#F5F5DC]">
        <h2 className="text-3xl font-bold text-center text-[#1C5532] mb-12">
          Mengapa Memilih PasarKu?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-[#76AB51] rounded-lg flex items-center justify-center mb-4">
              <FiShoppingBag className="w-6 h-6 text-[#F5F5DC]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1C5532] mb-2">
              Belanja Mudah
            </h3>
            <p className="text-[#1C5532]">
              Temukan berbagai produk berkualitas dari pedagang terpercaya
              dengan harga terbaik
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-[#76AB51] rounded-lg flex items-center justify-center mb-4">
              <FiMapPin className="w-6 h-6 text-[#F5F5DC]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1C5532] mb-2">
              Lokasi Terdekat
            </h3>
            <p className="text-[#1C5532]">
              Temukan pasar dan pedagang terdekat dengan lokasi Anda
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-[#76AB51] rounded-lg flex items-center justify-center mb-4">
              <FiShield className="w-6 h-6 text-[#F5F5DC]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1C5532] mb-2">
              Transaksi Aman
            </h3>
            <p className="text-[#1C5532]">
              Sistem pembayaran yang aman dan terpercaya untuk setiap transaksi
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-[#F5F5DC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1C5532] mb-12">
            Cara Kerja PasarKu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#76AB51] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-[#F5F5DC]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1C5532] mb-2">
                Cari Produk
              </h3>
              <p className="text-[#1C5532]">
                Temukan produk yang Anda inginkan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#76AB51] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="w-8 h-8 text-[#F5F5DC]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1C5532] mb-2">
                Pilih Produk
              </h3>
              <p className="text-[#1C5532]">
                Pilih produk dan tambahkan ke keranjang
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#76AB51] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-8 h-8 text-[#F5F5DC]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1C5532] mb-2">
                Pembayaran
              </h3>
              <p className="text-[#1C5532]">Lakukan pembayaran dengan aman</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#76AB51] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="w-8 h-8 text-[#F5F5DC]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1C5532] mb-2">
                Pengiriman
              </h3>
              <p className="text-[#1C5532]">
                Produk akan dikirim ke lokasi Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#F5F5DC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#1C5532] mb-4">
            Siap Memulai Belanja?
          </h2>
          <p className="text-xl mb-8 text-[#1C5532]">
            Bergabunglah dengan ribuan pengguna PasarKu lainnya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#1C5532] text-[#F5F5DC] px-8 py-3 rounded-xl font-medium hover:bg-[#76AB51] transition duration-300"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/products"
              className="bg-[#76AB51] text-[#F5F5DC] px-8 py-3 rounded-xl font-medium hover:bg-[#1C5532] transition duration-300"
            >
              Lihat Produk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
