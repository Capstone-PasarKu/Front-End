import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiMapPin,
  FiSearch,
  FiTruck,
  FiShield,
  FiClock,
  FiArrowRight,
  FiX,
  FiUser,
  FiTag,
  FiShoppingCart,
} from "react-icons/fi";
import { searchProducts } from "../services/api"; // Sesuaikan path ke file API service
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for modal
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [merchants, setMerchants] = useState([]);

  const categories = [
    { value: "", label: "Semua" },
    { value: "buah", label: "Buah" },
    { value: "sayuran", label: "Sayuran" },
    { value: "daging", label: "Daging" },
    { value: "ikan", label: "Ikan" },
    { value: "rempah", label: "Rempah" },
  ];

  // Fetch featured products
  const fetchFeaturedProducts = async (query = "", cat = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query, "termurah");
      let filteredProducts = data.map((item) => ({
        id: item.id,
        name: item.item.name,
        price: item.item.basePrice,
        image: item.item.photoUrl || "https://via.placeholder.com/150",
        description: `Dijual oleh ${item.merchant.name} - Kategori: ${item.item.category}`,
        seller: item.merchant.name,
        category: item.item.category,
      }));
      if (cat) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category.toLowerCase() === cat.toLowerCase()
        );
      }
      setFeaturedProducts(filteredProducts.slice(0, 6)); // Limit to 6 products
    } catch (err) {
      setError(err.message);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount and when selectedCategory changes
  useEffect(() => {
    fetchFeaturedProducts(searchQuery, selectedCategory);
  }, [selectedCategory]);

  // Debounced search effect
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchFeaturedProducts(searchQuery, selectedCategory);
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Fetch merchants for map
  useEffect(() => {
    fetch("https://pasarku-backend.vercel.app/api/merchants")
      .then((res) => res.json())
      .then((data) => setMerchants(data))
      .catch(() => setMerchants([]));
  }, []);

  const markerIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // Ganti dengan icon yang lebih menarik jika mau
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -36],
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    fetchFeaturedProducts(searchQuery, selectedCategory);
  };

  // Handle category button click
  const handleCategoryClick = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

  // Open modal with selected product
  const openModal = (product) => {
    setSelectedProduct(product);
  };

  // Close modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

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
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-6 py-4 rounded-xl border-2 border-[#76AB51] focus:outline-none focus:border-[#1C5532] text-[#1C5532] bg-white shadow-sm"
              />
              <button
                onClick={handleSearchClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1C5532] text-[#F5F5DC] p-3 rounded-lg hover:bg-[#76AB51] transition duration-300 shadow-sm"
              >
                <FiSearch className="text-xl" />
              </button>
            </div>
            {/* Category Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategoryClick(cat.value)}
                  aria-pressed={selectedCategory === cat.value}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#1C5532]/30 shadow-md
                    ${
                      selectedCategory === cat.value
                        ? "bg-[#1C5532] text-[#F5F5DC] border-2 border-[#1C5532] shadow-inner"
                        : "bg-[#76AB51] text-[#F5F5DC] border-2 border-transparent hover:bg-[#1C5532] hover:border-[#1C5532]"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-[#F5F5DC]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-green-700 mb-8 text-center drop-shadow">
            Produk Unggulan
          </h2>
          {loading && (
            <p className="text-center text-gray-500">Memuat produk...</p>
          )}
          {error && <p className="text-center text-red-500">Error: {error}</p>}
          {!loading && !error && featuredProducts.length === 0 && (
            <p className="text-center text-gray-500">
              Tidak ada produk ditemukan untuk pencarian "
              {searchQuery ||
                categories.find((cat) => cat.value === selectedCategory)
                  ?.label ||
                "Semua"}
              "
            </p>
          )}
          {!loading && !error && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-lg mb-4 border"
                  />
                  <h3 className="text-lg font-bold text-green-800 mb-2 text-center">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2 text-center line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-green-700 font-semibold text-xl mb-4">
                    Rp{product.price.toLocaleString("id-ID")}
                  </p>
                  <button
                    onClick={() => openModal(product)}
                    className="mt-auto bg-[#1C5532] hover:bg-[#76AB51] text-[#F5F5DC] px-4 py-2 rounded shadow transition-colors"
                  >
                    Lihat Detail
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500 focus:outline-none"
              aria-label="Tutup modal"
            >
              <FiX className="text-3xl" />
            </button>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <img
                  src={
                    selectedProduct.image || "https://via.placeholder.com/300"
                  }
                  alt={selectedProduct.name || "Gambar Produk"}
                  className="w-56 h-56 object-cover rounded-xl border-4 border-[#76AB51] shadow-md"
                />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-3xl font-bold text-[#1C5532] mb-2">
                  {selectedProduct.name}
                </h3>
                <div className="text-gray-600 text-base flex items-center justify-center md:justify-start gap-2 mb-4">
                  <FiUser className="text-gray-400" />
                  <span className="font-medium">
                    {selectedProduct.seller || "Toko Alex"}
                  </span>
                  <span className="mx-1">•</span>
                  <FiTag className="text-gray-400" />
                  <span className="font-medium capitalize">
                    {selectedProduct.category || "buah"}
                  </span>
                </div>
                <p className="text-[#1C5532] text-2xl font-semibold mb-6">
                  Rp{selectedProduct.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Map Section */}
      <div className="bg-[#F5F5DC] py-16 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-[#1C5532] mb-2 text-center">
          Temukan Pasar & Pedagang Terdekat
        </h2>
        <p className="text-[#1C5532] mb-8 text-center max-w-2xl">
          Jelajahi lokasi pasar tradisional dan pedagang yang telah bergabung
          dengan <span className="font-bold text-[#76AB51]">PasarKu</span>. Klik
          marker untuk info detail dan foto merchant!
        </p>
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border-2 border-[#76AB51] bg-white">
          <MapContainer
            center={[-6.3549, 106.8277]}
            zoom={7}
            style={{ height: "420px", width: "100%" }}
            scrollWheelZoom={true}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {merchants.length === 0 && (
              <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center z-10">
                <span className="bg-white px-4 py-2 rounded shadow text-[#1C5532]">
                  Data merchant belum tersedia
                </span>
              </div>
            )}
            {merchants.map((merchant) =>
              merchant.location?.lat && merchant.location?.lng ? (
                <Marker
                  key={merchant.id}
                  position={[merchant.location.lat, merchant.location.lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div className="text-center min-w-[180px]">
                      {merchant.photoUrl ? (
                        <img
                          src={merchant.photoUrl}
                          alt={merchant.name}
                          className="w-20 h-20 object-cover rounded-full mx-auto mb-2 border-2 border-[#76AB51]"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[#F5F5DC] flex items-center justify-center mx-auto mb-2 border-2 border-[#76AB51] text-[#76AB51]">
                          <FiUser size={32} />
                        </div>
                      )}
                      <strong className="block text-lg text-[#1C5532] mb-1">
                        {merchant.name}
                      </strong>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-1 ${
                          merchant.category.toLowerCase() === "buah"
                            ? "bg-green-100 text-green-700"
                            : merchant.category.toLowerCase() === "daging"
                            ? "bg-red-100 text-red-700"
                            : merchant.category.toLowerCase() === "ikan"
                            ? "bg-blue-100 text-blue-700"
                            : merchant.category.toLowerCase() === "sayuran"
                            ? "bg-lime-100 text-lime-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {merchant.category}
                      </span>
                      <div className="text-xs text-gray-500 mb-1">
                        Lat: {merchant.location.lat.toFixed(4)}, Lng:{" "}
                        {merchant.location.lng.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {merchant.id.slice(0, 8)}...
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;
