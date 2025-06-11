import { useEffect, useState } from "react";
import { FiX, FiShoppingCart, FiUser, FiTag, FiSearch } from "react-icons/fi";
import { searchProducts, addToCart } from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("termurah");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for modal
  const [cartLoading, setCartLoading] = useState(false); // Loading state for cart action
  const [cartMessage, setCartMessage] = useState(""); // Message for cart action feedback

  const categories = [
    { value: "", label: "Semua Kategori" },
    { value: "buah", label: "Buah" },
    { value: "sayur", label: "Sayur" },
    { value: "seafood", label: "Seafood" },
    { value: "rempah", label: "Rempah" },
    { value: "daging", label: "Daging" },
  ];

  const fetchProducts = async (query = "", sort = "termurah", cat = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query, sort);
      console.log("Data hasil searchProducts:", data); // Tambahkan log ini
      let filteredProducts = data.map((item) => ({
        id: item.id,
        name: item.item.name,
        price: item.item.basePrice,
        image: item.item.photoUrl || "https://via.placeholder.com/150",
        description: `Dijual oleh ${
          item.merchant?.name || item.merchantId || "-"
        } - Kategori: ${item.item.category}`,
        itemCategory: item.item.category,
        merchantId: item.merchant?.id || item.merchantId, // Coba fallback ke item.merchantId
        seller: item.merchant?.name || item.merchantId || "-", // Coba fallback ke item.merchantId
        category: item.item.category,
      }));
      if (cat) {
        filteredProducts = filteredProducts.filter(
          (product) => product.itemCategory.toLowerCase() === cat.toLowerCase()
        );
      }
      setProducts(filteredProducts);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts(searchQuery, sortBy, category);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery, sortBy, category]); // Add sortBy and category as dependencies

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    fetchProducts(searchQuery, sortBy, category);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = async (product) => {
    setCartLoading(true);
    setCartMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Silakan login terlebih dahulu.");
        window.location.href = "/login"; // Atau gunakan React Router
        return;
      }

      if (!product.merchantId) {
        setCartMessage(
          "Gagal menambah ke keranjang: merchantId tidak ditemukan pada produk ini."
        );
        setCartLoading(false);
        return;
      }

      const cartData = {
        itemId: product.id,
        quantity: 1,
        merchantId: product.merchantId, // Ambil dari merchantId langsung
      };

      // Log untuk debugging
      console.log("Mengirim data ke API:", cartData);

      const response = await addToCart(token, cartData);
      setCartMessage(`Berhasil ditambahkan ke keranjang! ID: ${response.id}`);
    } catch (error) {
      console.error("Gagal menambah ke keranjang:", error);
      setCartMessage(`Gagal menambah barang ke keranjang: ${error.message}`);
    } finally {
      setCartLoading(false);
      setTimeout(() => setCartMessage(""), 5000);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F5F5DC]">
      <h2 className="text-3xl font-extrabold text-[#1C5532] mb-8 text-center drop-shadow">
        Katalog Produk
      </h2>

      <section className="py-6 bg-[#F5F5DC]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-6 py-4 rounded-xl border-2 border-[#76AB51] focus:outline-none focus:border-[#1C5532] text-[#1C5532] bg-white"
              />
              <button
                onClick={handleSearchClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1C5532] text-[#F5F5DC] p-3 rounded-lg hover:bg-[#76AB51] transition duration-300"
              >
                <FiSearch className="text-xl" />
              </button>
            </div>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="px-4 py-4 rounded-xl border-2 border-[#76AB51] focus:outline-none focus:border-[#1C5532] text-[#1C5532] bg-white w-full sm:w-48"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-4 rounded-xl border-2 border-[#76AB51] focus:outline-none focus:border-[#1C5532] text-[#1C5532] bg-white w-full sm:w-48"
            >
              <option value="termurah">Termurah</option>
              <option value="termahal">Termahal</option>
            </select>
          </div>
        </div>
      </section>

      {loading && <p className="text-center text-gray-500">Memuat produk...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">Tidak ada produk ditemukan</p>
      )}

      {products.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center"
            >
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg mb-4 border"
              />
              <h3 className="text-lg font-bold text-[#1C5532] mb-2 text-center">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-500 text-sm mb-2 text-center line-clamp-2">
                  {product.description}
                </p>
              )}
              <p className="text-[#1C5532] font-semibold text-xl mb-4">
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
                <div className="flex justify-center md:justify-start">
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="flex items-center gap-2 bg-[#76AB51] hover:bg-[#F0A04B] text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300"
                    disabled={cartLoading}
                  >
                    {cartLoading ? (
                      <span className="animate-pulse">Memproses...</span>
                    ) : (
                      <>
                        <FiShoppingCart className="text-2xl" />
                        Tambah ke Keranjang
                      </>
                    )}
                  </button>
                </div>
                {cartMessage && (
                  <p
                    className={`mt-4 text-center ${
                      cartMessage.includes("Gagal")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {cartMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
