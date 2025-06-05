import React from "react";
import { FiTarget, FiUsers, FiTrendingUp, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-[#F5F5DC] font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#1C5532] to-[#76AB51] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/market-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Tentang PasarKu
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#F5F5DC]/90 max-w-3xl mx-auto leading-relaxed">
            Menjembatani tradisi dan teknologi untuk masa depan pasar tradisional Indonesia
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 bg-[#E57B2D] text-[#F5F5DC] px-6 py-3 rounded-full font-semibold hover:bg-[#F0A04B] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Jelajahi Produk
          </Link>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 transform hover:scale-[1.01] transition-transform duration-300">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C5532] mb-8 text-center">
            Visi Kami
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            PasarKu adalah platform digital yang dirancang untuk menghubungkan pedagang pasar tradisional dengan pembeli modern. Di era belanja online dan kemajuan teknologi, pasar tradisional sering kali terbatas pada interaksi fisik yang kurang efisien bagi masyarakat dengan mobilitas tinggi, seperti ibu rumah tangga dan pekerja kantoran.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Dengan fitur seperti peta pasar interaktif, manajemen stok real-time, pembayaran digital, dan teknologi AI untuk analisis kebutuhan belanja, PasarKu hadir untuk menghadirkan pengalaman belanja pasar tradisional yang mudah, cepat, dan tetap mempertahankan nuansa lokal.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-[#F5F5DC] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1C5532] mb-12">
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-[#76AB51]/10 rounded-xl flex items-center justify-center mb-4">
                <FiTarget className="w-8 h-8 text-[#76AB51]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1C5532] mb-2">
                Inovasi
              </h3>
              <p className="text-gray-600 text-base">
                Terus berinovasi untuk memberikan solusi terbaik bagi pedagang dan pembeli.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-[#76AB51]/10 rounded-xl flex items-center justify-center mb-4">
                <FiUsers className="w-8 h-8 text-[#76AB51]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1C5532] mb-2">
                Kolaborasi
              </h3>
              <p className="text-gray-600 text-base">
                Membangun kerjasama yang kuat antara pedagang, pembeli, dan komunitas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-[#76AB51]/10 rounded-xl flex items-center justify-center mb-4">
                <FiTrendingUp className="w-8 h-8 text-[#76AB51]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1C5532] mb-2">
                Pertumbuhan
              </h3>
              <p className="text-gray-600 text-base">
                Mendorong pertumbuhan ekonomi lokal melalui digitalisasi pasar tradisional.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-[#76AB51]/10 rounded-xl flex items-center justify-center mb-4">
                <FiHeart className="w-8 h-8 text-[#76AB51]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1C5532] mb-2">
                Kearifan Lokal
              </h3>
              <p className="text-gray-600 text-base">
                Menjaga dan memperkuat nilai-nilai budaya lokal dalam era digital.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-[#76AB51] to-[#1C5532] rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Masa Depan Pasar Tradisional
          </h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Dengan PasarKu, kami percaya bahwa digitalisasi tidak harus menghilangkan kearifan lokal, tapi justru menjadi jembatan untuk memperkuat dan memperluas dampaknya. Kami berkomitmen untuk mengembangkan platform yang memudahkan transaksi, melestarikan budaya, dan memperkuat ekonomi lokal.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#E57B2D] text-[#F5F5DC] px-8 py-3 rounded-full font-semibold hover:bg-[#F0A04B] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Mulai Belanja Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;