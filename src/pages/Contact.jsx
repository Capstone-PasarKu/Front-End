import React, { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { getMerchants, sendMessage, getUserFromToken } from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    merchantId: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [merchantLoading, setMerchantLoading] = useState(true);
  const [merchantError, setMerchantError] = useState(null);
  const [token, setToken] = useState(null);

  // Ambil token dari localStorage dan validasi
  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setError("Anda harus login terlebih dahulu untuk mengirim pesan.");
        return;
      }

      const user = getUserFromToken(storedToken);
      if (!user) {
        setError("Token tidak valid atau kadaluarsa. Silakan login kembali.");
        localStorage.removeItem("token");
        return;
      }

      setToken(storedToken);
    };
    fetchToken();
  }, []);

  // Fetch daftar toko (merchants)
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const data = await getMerchants(token);
        setMerchants(data);
        setMerchantLoading(false);
      } catch (err) {
        setMerchantError("Gagal memuat daftar toko. Silakan coba lagi nanti.");
        setMerchantLoading(false);
      }
    };
    if (token) {
      fetchMerchants();
    } else {
      setMerchantLoading(false);
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!token) {
      setError("Anda harus login terlebih dahulu untuk mengirim pesan.");
      setLoading(false);
      return;
    }

    try {
      await sendMessage(token, {
        storeName: formData.merchantId,
        message: formData.message,
      });

      setSuccess(true);
      setFormData({ name: "", merchantId: "", message: "" });
    } catch (err) {
      setError(err.message || "Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Hubungi Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ada pertanyaan atau saran? Pilih toko tujuan dan kirim pesan Anda. Kami siap membantu!
          </p>
        </div>

        <div className="w-full flex justify-center">
          {/* Contact Form */}
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
              Kirim Pesan
            </h2>
            {success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#76AB51] focus:border-[#76AB51] transition-colors placeholder-gray-400"
                    placeholder="Masukkan nama Anda"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="merchantId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pilih Toko
                  </label>
                  {merchantLoading ? (
                    <div className="w-full h-12 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#76AB51] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : merchantError ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                      {merchantError}
                    </div>
                  ) : merchants.length === 0 ? (
                    <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                      Tidak ada toko yang tersedia saat ini.
                    </div>
                  ) : (
                    <select
                      id="merchantId"
                      name="merchantId"
                      value={formData.merchantId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#76AB51] focus:border-[#76AB51] transition-colors bg-white"
                      aria-required="true"
                    >
                      <option value="" disabled>
                        Pilih toko tujuan
                      </option>
                      {merchants.map((merchant) => (
                        <option key={merchant.id} value={merchant.id}>
                          {merchant.name} ({merchant.category})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#76AB51] focus:border-[#76AB51] transition-colors placeholder-gray-400"
                    placeholder="Masukkan pesan Anda"
                    aria-required="true"
                  ></textarea>
                </div>
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading || merchantLoading}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white ${
                    loading || merchantLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#76AB51] hover:bg-[#5A8C3D]"
                  } transition-colors duration-200`}
                >
                  {loading ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <FiSend className="w-5 h-5 mr-2" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;