import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(state?.cartItems || []);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatRupiah = (value) => {
    return value.toLocaleString("id-ID");
  };

  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");
      const data = [
        { id: 1, name: "Transfer Bank", fee: 0 },
        { id: 2, name: "COD", fee: 0 },
      ];
      setPaymentMethods(data);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      setError(`Gagal memuat metode pembayaran: ${err.message}. Silakan coba lagi.`);
    } finally {
      setLoading(false);
    }
  };

  const fetchShippingMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");
      const data = [
        { id: 1, name: "Ambil di Tempat", cost: 0, eta: "1-2 hari" },
        { id: 2, name: "Diantar", cost: 0, eta: "1-2 hari" },
        { id: 3, name: "GoSend Same Day", cost: 25000, eta: "Hari yang sama" },
      ];
      setShippingMethods(data);
    } catch (err) {
      console.error("Error fetching shipping methods:", err);
      setError(`Gagal memuat metode pengiriman: ${err.message}. Silakan coba lagi.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
    fetchShippingMethods();
  }, []);

  const totalItem = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalHarga = cartItems.reduce(
    (sum, item) => sum + item.item.basePrice * item.quantity,
    0
  );
  const shippingCost = selectedShipping?.cost || 0;
  const paymentFee = selectedPayment?.fee || 0;
  const grandTotal = totalHarga + shippingCost + paymentFee;

  const validateInputs = () => {
    if (!selectedPayment || !selectedShipping) {
      setError("Harap pilih metode pembayaran dan pengiriman.");
      return false;
    }
    if (
      (selectedShipping.name === "Diantar" || selectedShipping.name === "GoSend Same Day") &&
      !shippingAddress.trim()
    ) {
      setError("Harap masukkan alamat pengiriman.");
      return false;
    }
    return true;
  };

  const handleConfirmPayment = async () => {
    if (!validateInputs()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmModal = async () => {
    setLoading(true);
    setError(null);
    setShowConfirmModal(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");
      // Placeholder API call for confirming payment
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      navigate("/order-confirmation", {
        state: { cartItems, selectedPayment, selectedShipping, shippingAddress, grandTotal },
      });
    } catch (err) {
      console.error("Error confirming payment:", err);
      setError(`Gagal memproses pembayaran: ${err.message}. Silakan coba lagi.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5DC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#76AB51] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat halaman pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5DC] px-4">
        <p className="text-red-600 text-lg font-semibold bg-red-50 p-4 rounded-xl shadow-md">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchPaymentMethods();
            fetchShippingMethods();
          }}
          className="mt-4 bg-[#1C5532] hover:bg-[#76AB51] text-[#F5F5DC] px-6 py-2 rounded-xl font-semibold shadow transition duration-300"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5DC] px-4">
        <h2 className="text-3xl font-bold text-[#1C5532] mb-4">Tidak Ada Item untuk Diproses</h2>
        <p className="text-gray-600 mb-6">Kembali ke keranjang untuk menambahkan item.</p>
        <button
          onClick={() => navigate("/cart")}
          className="bg-[#1C5532] hover:bg-[#76AB51] text-[#F5F5DC] px-6 py-3 rounded-xl font-semibold shadow transition duration-300"
        >
          Kembali ke Keranjang
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 p-4 md:p-8 min-h-screen bg-[#F5F5DC]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center text-[#1C5532] hover:text-[#76AB51] font-semibold transition duration-300"
          >
            <FiArrowLeft className="mr-2 text-xl" />
            Kembali ke Keranjang
          </button>
        </div>
        <h2 className="text-4xl font-extrabold text-[#1C5532] mb-10 text-center drop-shadow-md">
          Halaman Pembayaran
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">Ringkasan Pesanan</h3>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4 pb-4 border-b border-[#76AB51]/10"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.item.photoUrl || "https://via.placeholder.com/80"}
                    alt={item.item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-[#76AB51]/20"
                  />
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {item.item.name} (x{item.quantity})
                    </p>
                    <p className="text-sm text-gray-500">Toko: {item.merchant?.name || "N/A"}</p>
                  </div>
                </div>
                <p className="font-semibold text-[#1C5532]">
                  Rp{formatRupiah(item.item.basePrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          {(selectedShipping?.name === "Diantar" || selectedShipping?.name === "GoSend Same Day") && (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
              <h3 className="text-xl font-bold text-[#1C5532] mb-4">Alamat Pengiriman</h3>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Masukkan alamat pengiriman lengkap"
                className="w-full p-3 border border-[#76AB51]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76AB51] transition duration-300"
                rows={4}
              />
            </div>
          )}

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">Metode Pembayaran</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 shadow-sm hover:shadow-md ${
                    selectedPayment?.id === method.id
                      ? "border-[#76AB51] bg-[#76AB51]/10"
                      : "border-[#76AB51]/30 hover:bg-[#76AB51]/5"
                  }`}
                  disabled={loading}
                >
                  <p className="font-semibold text-[#1C5532]">{method.name}</p>
                  <p className="text-sm text-gray-500">
                    Biaya: Rp{formatRupiah(method.fee)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Shipping Methods */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">Metode Pengiriman</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shippingMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedShipping(method)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 shadow-sm hover:shadow-md ${
                    selectedShipping?.id === method.id
                      ? "border-[#76AB51] bg-[#76AB51]/10"
                      : "border-[#76AB51]/30 hover:bg-[#76AB51]/5"
                  }`}
                  disabled={loading}
                >
                  <p className="font-semibold text-[#1C5532]">{method.name}</p>
                  <p className="text-sm text-gray-500">
                    Biaya: Rp{formatRupiah(method.cost)}
                  </p>
                  <p className="text-sm text-gray-500">Estimasi: {method.eta}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Total Summary and Confirm Payment */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">Total Harga</h3>
            <div className="space-y-2">
              <p className="flex justify-between text-gray-700">
                <span>Total Item:</span>
                <span className="font-semibold text-[#1C5532]">{totalItem}</span>
              </p>
              <p className="flex justify-between text-gray-700">
                <span>Total Harga Barang:</span>
                <span className="font-semibold text-[#1C5532]">
                  Rp{formatRupiah(totalHarga)}
                </span>
              </p>
              <p className="flex justify-between text-gray-700">
                <span>Biaya Pengiriman:</span>
                <span className="font-semibold text-[#1C5532]">
                  Rp{formatRupiah(shippingCost)}
                </span>
              </p>
              <p className="flex justify-between text-gray-700">
                <span>Biaya Pembayaran:</span>
                <span className="font-semibold text-[#1C5532]">
                  Rp{formatRupiah(paymentFee)}
                </span>
              </p>
              <p className="flex justify-between text-lg font-bold text-[#76AB51] pt-2 border-t border-[#76AB51]/20">
                <span>Grand Total:</span>
                <span>Rp{formatRupiah(grandTotal)}</span>
              </p>
            </div>
            <button
              onClick={handleConfirmPayment}
              className="w-full mt-6 bg-[#1C5532] hover:bg-[#76AB51] text-[#F5F5DC] px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
              disabled={
                loading ||
                !selectedPayment ||
                !selectedShipping ||
                ((selectedShipping?.name === "Diantar" || selectedShipping?.name === "GoSend Same Day") &&
                  !shippingAddress.trim())
              }
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">Konfirmasi Pembayaran</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin melanjutkan pembayaran sebesar{" "}
              <span className="font-semibold text-[#76AB51]">
                Rp{formatRupiah(grandTotal)}
              </span>{" "}
              dengan metode pembayaran{" "}
              <span className="font-semibold">{selectedPayment.name}</span> dan pengiriman{" "}
              <span className="font-semibold">{selectedShipping.name}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition duration-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmModal}
                className="px-4 py-2 bg-[#1C5532] text-[#F5F5DC] rounded-xl font-semibold hover:bg-[#76AB51] transition duration-300"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;