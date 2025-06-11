import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { removeCartItem } from "../services/api";

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
  const [paymentProof, setPaymentProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
        {
          id: 1,
          name: "Transfer Bank", // Display name for user
          value: "digital", // API value - this is what gets sent to the API
          fee: 0,
          bankAccount: "1234-5678-9012-3456 (Bank ABC)",
        },
        
      ];
      setPaymentMethods(data);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      setError(
        `Gagal memuat metode pembayaran: ${err.message}. Silakan coba lagi.`
      );
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
        {
          id: 1,
          name: "pickup",
          cost: 0,
          eta: "1-2 hari",
          displayName: "Ambil di Tempat",
        },
        {
          id: 2,
          name: "delivery",
          cost: 0,
          eta: "1-2 hari",
          displayName: "Pengiriman",
        },
      ];
      setShippingMethods(data);
    } catch (err) {
      console.error("Error fetching shipping methods:", err);
      setError(
        `Gagal memuat metode pengiriman: ${err.message}. Silakan coba lagi.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("cartItems in Payment:", JSON.parse(JSON.stringify(cartItems)));
    fetchPaymentMethods();
    fetchShippingMethods();
  }, [cartItems]);

  const totalItem = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalHarga = cartItems.reduce(
    (sum, item) => sum + (item.item?.basePrice || 0) * (item.quantity || 0),
    0
  );
  const shippingCost = selectedShipping?.cost || 0;
  const paymentFee = selectedPayment?.fee || 0;
  const grandTotal = totalHarga + shippingCost + paymentFee;

  const validateInputs = () => {
    console.log(
      "Validating inputs with cartItems:",
      JSON.parse(JSON.stringify(cartItems))
    );
    if (!selectedPayment) {
      setError("Harap pilih metode pembayaran.");
      return false;
    }
    if (!selectedShipping) {
      setError("Harap pilih metode pengiriman.");
      return false;
    }
    if (selectedShipping.name === "delivery" && !shippingAddress.trim()) {
      setError("Harap masukkan alamat pengiriman untuk metode Pengiriman.");
      return false;
    }
    // Fix: Change from selectedPayment.name to selectedPayment.value
    if (selectedPayment.value === "digital" && !paymentProof) {
      setError("Harap unggah bukti pembayaran untuk Transfer Bank.");
      return false;
    }
    if (!cartItems || !cartItems.length) {
      setError("Keranjang kosong. Silakan tambahkan item.");
      console.error("Validation failed: Empty cartItems", { cartItems });
      return false;
    }

    const invalidItem = cartItems.find((item) => {
      const merchantId = item.merchantId;
      const itemId = item.itemId;
      const isInvalid =
        !merchantId || !itemId || !item.quantity || item.quantity <= 0;
      if (isInvalid) {
        console.log("Invalid item detected:", {
          item,
          merchantId,
          itemId,
          quantity: item.quantity,
        });
      }
      return isInvalid;
    });
    if (invalidItem) {
      let errorMessage = "Data item tidak valid: ";
      if (!invalidItem.merchantId) errorMessage += "ID merchant tidak ada. ";
      if (!invalidItem.itemId) errorMessage += "ID item tidak ada. ";
      if (!invalidItem.quantity || invalidItem.quantity <= 0)
        errorMessage += "Kuantitas tidak valid. ";
      errorMessage += "Silakan periksa keranjang Anda.";
      setError(errorMessage);
      console.error("Validation failed: Invalid item data", {
        invalidItem,
        cartItems: JSON.parse(JSON.stringify(cartItems)),
      });
      return false;
    }

    return true;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Harap unggah file berupa gambar (jpg, png, dll).");
        setPaymentProof(null);
        setPreviewUrl(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran gambar terlalu besar. Maksimum 5MB.");
        setPaymentProof(null);
        setPreviewUrl(null);
        return;
      }
      setPaymentProof(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removePaymentProof = () => {
    setPaymentProof(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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

      const failedItems = [];

      for (const item of cartItems) {
        try {
          const merchantId = item.merchantId;
          const itemId = item.itemId;

          if (!merchantId || !itemId) {
            throw new Error("merchantId atau itemId tidak valid");
          }

          const formData = new FormData();
          formData.append("merchantId", merchantId);
          formData.append("itemId", itemId);
          formData.append("quantity", item.quantity);
          formData.append("deliveryMethod", selectedShipping.name);
          formData.append("paymentMethod", selectedPayment.value);
          formData.append("address", shippingAddress || "");

          // Fix: Only append payment proof if it exists and payment method is digital
          if (selectedPayment.value === "digital" && paymentProof) {
            formData.append("paymentProof", paymentProof);
          }

          console.log("Sending order for item:", {
            merchantId,
            itemId,
            quantity: item.quantity,
            deliveryMethod: selectedShipping.name,
            paymentMethod: selectedPayment.value, // Fix: log the correct value
            address: shippingAddress,
            hasPaymentProof: !!paymentProof,
          });

          const response = await fetch(
            "https://pasarku-backend.vercel.app/api/order",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("API error response:", errorData);
            throw new Error(
              errorData.message ||
                `Gagal memproses item: ${item.item?.name || "Unknown"}`
            );
          }

          const responseData = await response.json();
          console.log("API success response:", responseData);
        } catch (err) {
          console.error(
            `Error processing item ${item.item?.name || item.id}:`,
            err
          );
          failedItems.push({
            itemName: item.item?.name || item.id,
            error: err.message,
          });
        }
      }

      if (failedItems.length > 0) {
        const errorMessage = `Gagal memproses ${
          failedItems.length
        } item: ${failedItems
          .map((fi) => `${fi.itemName} (${fi.error})`)
          .join(", ")}. Silakan coba lagi.`;
        throw new Error(errorMessage);
      }

      // Clear the cart by removing each item
      for (const item of cartItems) {
        try {
          await removeCartItem(token, item.id);
          console.log(`Successfully removed cart item ${item.id}`);
        } catch (err) {
          console.error(`Failed to remove cart item ${item.id}:`, err);
          // Optionally, collect errors but don't block the process
        }
      }
      
      alert("Semua item berhasil diproses!");
      setSelectedPayment(null);
      setSelectedShipping(null);
      setShippingAddress("");
      setCartItems([]);
      setPaymentProof(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      navigate("/cart");
    } catch (err) {
      console.error("Error confirming payment:", err);
      setError(
        `Gagal memproses pembayaran: ${err.message}. Silakan coba lagi.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
        <p className="text-red-600 text-lg font-semibold bg-red-50 p-4 rounded-xl shadow-md">
          {error}
        </p>
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
        <h2 className="text-3xl font-bold text-[#1C5532] mb-4">
          Tidak Ada Item untuk Diproses
        </h2>
        <p className="text-gray-600 mb-6">
          Kembali ke keranjang untuk menambahkan item.
        </p>
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
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">
              Ringkasan Pesanan
            </h3>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4 pb-4 border-b border-[#76AB51]/10"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.item?.photoUrl || "https://via.placeholder.com/80"
                    }
                    alt={item.item?.name || "Item"}
                    className="w-16 h-16 object-cover rounded-lg border border-[#76AB51]/20"
                  />
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {item.item?.name || "N/A"} (x{item.quantity || 0})
                    </p>
                    <p className="text-sm text-gray-500">
                      Toko: {item.merchant?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-[#1C5532]">
                  Rp
                  {formatRupiah(
                    (item.item?.basePrice || 0) * (item.quantity || 0)
                  )}
                </p>
              </div>
            ))}
          </div>

          {selectedShipping?.name === "delivery" && (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
              <h3 className="text-xl font-bold text-[#1C5532] mb-4">
                Alamat Pengiriman
              </h3>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Masukkan alamat pengiriman lengkap"
                className="w-full p-3 border border-[#76AB51]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76AB51] transition duration-300"
                rows={4}
              />
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">
              Metode Pembayaran
            </h3>
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
                  {method.bankAccount && (
                    <p className="text-sm text-gray-500">
                      No. Rekening: {method.bankAccount}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">
              Metode Pengiriman
            </h3>
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
                  <p className="font-semibold text-[#1C5532]">
                    {method.displayName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Estimasi: {method.eta} | Biaya: Rp
                    {formatRupiah(method.cost)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#76AB51]/20">
            <h3 className="text-xl font-bold text-[#1C5532] mb-4">
              Total Pembayaran
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Total Harga ({totalItem} item)</span>
                <span>Rp{formatRupiah(totalHarga)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Pengiriman</span>
                <span>Rp{formatRupiah(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Pembayaran</span>
                <span>Rp{formatRupiah(paymentFee)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-[#1C5532] text-lg">
                <span>Grand Total</span>
                <span>Rp{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {selectedPayment?.value === "digital" && (
              <div className="mt-6">
                <label className="block text-sm font-semibold text-[#1C5532] mb-2">
                  Unggah Bukti Pembayaran
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-[#76AB51] text-[#F5F5DC] px-4 py-2 rounded-xl font-semibold hover:bg-[#1C5532] transition duration-300">
                    Pilih Gambar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {paymentProof && (
                    <span className="text-sm text-gray-600">
                      {paymentProof.name}
                    </span>
                  )}
                </div>
                {previewUrl && (
                  <div className="mt-4 relative">
                    <img
                      src={previewUrl}
                      alt="Bukti Pembayaran"
                      className="w-48 h-48 object-contain rounded-lg border border-[#76AB51]/20"
                    />
                    <button
                      onClick={removePaymentProof}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition duration-300"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleConfirmPayment}
              className="w-full mt-6 bg-[#1C5532] hover:bg-[#76AB51] text-[#F5F5DC] py-3 rounded-xl font-semibold shadow transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                loading ||
                !selectedPayment ||
                !selectedShipping ||
                (selectedShipping?.name === "delivery" &&
                  !shippingAddress.trim()) ||
                (selectedPayment?.value === "digital" && !paymentProof) // Fix: Change && to && and use correct condition
              }
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
            <h3 className="text-2xl font-bold text-[#1C5532] mb-4">
              Konfirmasi Pembayaran
            </h3>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin melanjutkan pembayaran sebesar{" "}
              <span className="font-semibold text-[#76AB51]">
                Rp{formatRupiah(grandTotal)}
              </span>{" "}
              dengan metode pembayaran{" "}
              <span className="font-semibold">
                {selectedPayment?.name || "N/A"}
              </span>{" "}
              dan pengiriman{" "}
              <span className="font-semibold">
                {selectedShipping?.displayName || "N/A"}
              </span>
              ?
            </p>
            {previewUrl &&
              selectedPayment?.value === "digital" && ( // Fix: Use value instead of name
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Bukti Pembayaran:
                  </p>
                  <img
                    src={previewUrl}
                    alt="Bukti Pembayaran"
                    className="w-32 h-32 object-contain mx-auto rounded-lg border border-[#76AB51]/20"
                  />
                </div>
              )}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-xl font-semibold transition duration-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmModal}
                className="px-6 py-2 bg-[#1C5532] hover:bg-[#76AB51] text-[#F5F5DC] rounded-xl font-semibold transition duration-300"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
