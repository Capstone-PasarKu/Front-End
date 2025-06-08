import { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { getCart, updateCartItem, removeCartItem } from "../services/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null); // Lacak item yang sedang diperbarui

  // Helper untuk format harga
  const formatRupiah = (value) => {
    return value.toLocaleString("id-ID");
  };

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");
      const data = await getCart(token);
      setCartItems(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(`Gagal memuat keranjang: ${err.message}. Silakan coba lagi.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleIncrease = async (cartId) => {
    setLoading(true);
    setUpdatingItemId(cartId);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");
      const itemToUpdate = cartItems.find((item) => item.id === cartId);
      if (!itemToUpdate) throw new Error("Item tidak ditemukan di keranjang");
      const newQuantity = itemToUpdate.quantity + 1;
      await updateCartItem(token, cartId, {
        quantity: newQuantity,
        merchantId: itemToUpdate.merchantId,
        itemId: itemToUpdate.itemId,
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error increasing quantity:", err);
      setError(`Gagal menambah kuantitas: ${err.message}. Silakan coba lagi.`);
      await fetchCart(); // Segarkan data keranjang jika error
    } finally {
      setLoading(false);
      setUpdatingItemId(null);
    }
  };

  const handleDecrease = async (cartId, quantity) => {
    if (quantity <= 1) return;
    setLoading(true);
    setUpdatingItemId(cartId);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");
      const itemToUpdate = cartItems.find((item) => item.id === cartId);
      if (!itemToUpdate) throw new Error("Item tidak ditemukan di keranjang");
      const newQuantity = quantity - 1;
      await updateCartItem(token, cartId, {
        quantity: newQuantity,
        merchantId: itemToUpdate.merchantId,
        itemId: itemToUpdate.itemId,
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error decreasing quantity:", err);
      setError(`Gagal mengurangi kuantitas: ${err.message}. Silakan coba lagi.`);
      await fetchCart(); // Segarkan data keranjang jika error
    } finally {
      setLoading(false);
      setUpdatingItemId(null);
    }
  };

  const handleRemoveFromCart = async (cartId) => {
    setLoading(true);
    setUpdatingItemId(cartId);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");
      await removeCartItem(token, cartId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
    } catch (err) {
      console.error("Error removing item:", err);
      setError(`Gagal menghapus item: ${err.message}. Silakan coba lagi.`);
      await fetchCart(); // Segarkan data keranjang jika error
    } finally {
      setLoading(false);
      setUpdatingItemId(null);
    }
  };

  const totalItem = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalHarga = cartItems.reduce(
    (sum, item) => sum + item.item.basePrice * item.quantity,
    0
  );

  if (loading && !updatingItemId) {
    return (
      <p className="text-center text-gray-500 mt-10">Memuat keranjang...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5DC] px-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Keranjang Kosong
        </h2>
        <p className="text-gray-500">Ayo belanja buah segar hari ini!</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#F5F5DC]">
      <h2 className="text-3xl font-extrabold text-[#1C5532] mb-10 text-center drop-shadow">
        Keranjang Belanja
      </h2>
      {/* Daftar Item Keranjang */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {cartItems.map((item) => {
          const { id, quantity, item: product, merchant } = item; // Destructure hanya field yang digunakan
          return (
            <div
              key={id}
              className="bg-white p-4 md:p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 transition-transform hover:scale-[1.01] border border-[#76AB51]/30"
            >
              {/* Gambar Produk */}
              <div className="flex-shrink-0 flex items-center justify-center w-full md:w-auto">
                <img
                  src={product.photoUrl || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border border-[#76AB51]/40 bg-gray-50"
                />
              </div>
              {/* Info Produk */}
              <div className="flex flex-col flex-1 justify-center md:justify-start md:ml-4">
                <h3 className="text-lg md:text-xl font-bold text-[#1C5532] mb-1">
                  {product.name}
                </h3>
                {merchant?.name && (
                  <p className="text-green-700 text-xs mb-1">
                    Toko: <span className="font-semibold">{merchant.name}</span>
                  </p>
                )}
                <p className="text-gray-500 text-sm mb-2">
                  Harga Satuan:{" "}
                  <span className="font-medium text-black">
                    Rp{formatRupiah(product.basePrice)}
                  </span>
                </p>
                {/* Kontrol Jumlah */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleDecrease(id, quantity)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F5DC] border-2 border-[#76AB51] text-[#1C5532] text-xl font-bold hover:bg-[#76AB51] hover:text-white hover:scale-110 active:scale-95 transition-all duration-150 shadow-sm"
                    aria-label="Kurangi jumlah"
                    disabled={quantity <= 1 || loading || updatingItemId === id}
                    title="Kurangi jumlah"
                  >
                    <span className="pointer-events-none select-none">−</span>
                  </button>
                  <span className="px-4 py-1 rounded-lg bg-gray-100 text-[#1C5532] font-bold text-lg border border-[#76AB51]/20 min-w-[36px] text-center shadow-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F5DC] border-2 border-[#76AB51] text-[#1C5532] text-xl font-bold hover:bg-[#76AB51] hover:text-white hover:scale-110 active:scale-95 transition-all duration-150 shadow-sm"
                    aria-label="Tambah jumlah"
                    disabled={loading || updatingItemId === id}
                    title="Tambah jumlah"
                  >
                    <span className="pointer-events-none select-none">+</span>
                  </button>
                </div>
              </div>
              {/* Harga Total & Hapus */}
              <div className="flex flex-col items-end justify-between gap-3 min-w-[110px] mt-4 md:mt-0">
                <span className="text-lg font-bold text-[#1C5532]">
                  Rp{formatRupiah(product.basePrice * quantity)}
                </span>
                <button
                  onClick={() => handleRemoveFromCart(id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-150 font-semibold shadow-sm active:scale-95"
                  title="Hapus item dari keranjang"
                  disabled={loading || updatingItemId === id}
                >
                  <FiTrash className="text-lg" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ringkasan Belanja */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#76AB51]/30">
        <div>
          <h3 className="text-lg font-bold text-[#1C5532] mb-2">
            Ringkasan Belanja
          </h3>
          <p className="text-gray-700">
            Total Item:{" "}
            <span className="font-semibold text-[#1C5532]">{totalItem}</span>
          </p>
          <p className="text-gray-700">
            Total Harga:{" "}
            <span className="font-bold text-[#76AB51] text-xl">
              Rp{formatRupiah(totalHarga)}
            </span>
          </p>
        </div>
        <button
          onClick={() => alert("Fitur checkout coming soon!")}
          className="bg-[#1C5532] hover:bg-[#76AB51] text-[#F5F5DC] px-8 py-3 rounded-xl font-semibold text-lg shadow transition duration-300"
          disabled={loading}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;