import React from "react";
import { FiTarget, FiUsers, FiTrendingUp, FiHeart } from "react-icons/fi";

const About = () => {
  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tentang PasarKu
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Menjembatani Tradisi dan Teknologi untuk Masa Depan Pasar Tradisional Indonesia
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Visi Kami
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            PasarKu adalah sebuah platform digital yang dirancang untuk menjembatani kesenjangan antara pedagang pasar tradisional dan pembeli modern. Di tengah maraknya belanja online dan perkembangan teknologi, pasar tradisional masih sangat bergantung pada interaksi fisik yang sering kali tidak efisien bagi masyarakat dengan mobilitas tinggi, seperti ibu rumah tangga dan pekerja kantoran.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Melihat kebutuhan akan solusi yang lebih praktis dan modern, PasarKu hadir untuk menghadirkan pengalaman belanja pasar tradisional secara online—mudah, cepat, dan tetap menjaga nuansa lokal. Melalui fitur-fitur seperti peta pasar interaktif, manajemen stok real-time, pembayaran digital, hingga teknologi AI untuk analisis kebutuhan belanja dan kualitas produk, kami ingin membawa pasar tradisional selangkah lebih maju dalam era digital.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-[#F5F5DC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FiTarget className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Inovasi
              </h3>
              <p className="text-gray-600">
                Terus berinovasi untuk memberikan solusi terbaik bagi pedagang dan pembeli
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Kolaborasi
              </h3>
              <p className="text-gray-600">
                Membangun kerjasama yang kuat antara pedagang, pembeli, dan komunitas
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FiTrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pertumbuhan
              </h3>
              <p className="text-gray-600">
                Mendorong pertumbuhan ekonomi lokal melalui digitalisasi pasar tradisional
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FiHeart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Kearifan Lokal
              </h3>
              <p className="text-gray-600">
                Menjaga dan memperkuat nilai-nilai budaya lokal dalam era digital
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#FFFFFF] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Masa Depan Pasar Tradisional
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Dengan PasarKu, kami percaya bahwa digitalisasi tidak harus menghilangkan kearifan lokal, tapi justru bisa menjadi jembatan untuk memperkuat dan memperluas dampaknya. Kami berkomitmen untuk terus mengembangkan platform yang tidak hanya memudahkan transaksi, tetapi juga melestarikan nilai-nilai budaya dan memperkuat ekonomi lokal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;