import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

const QualityCheck = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cek apakah user sudah login
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Silakan pilih foto produk terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Silakan login terlebih dahulu");
      }

      const formData = new FormData();
      formData.append("file", selectedFile); // <== Ganti 'image' ke 'file'

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // opsional jika FastAPI tidak menggunakan OAuth2
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gagal menganalisis kualitas produk");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cek Kualitas Produk
          </h1>
          <p className="text-lg text-gray-600">
            Gunakan teknologi AI untuk menganalisis kualitas produk Anda
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Upload Section */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 rounded-lg mb-4"
                  />
                ) : (
                  <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
                )}
                <span className="text-gray-600">
                  {preview
                    ? "Klik untuk mengganti foto"
                    : "Klik untuk memilih foto"}
                </span>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedFile}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                loading || !selectedFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } transition-colors`}
            >
              {loading ? "Menganalisis..." : "Analisis Kualitas"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 shadow-sm">
                <FiAlertCircle className="w-6 h-6 mt-0.5" />
                <div>
                  <p className="font-semibold">Terjadi Kesalahan</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Result Message */}
          {result && (
            <div
              className={`rounded-xl p-6 shadow-md ${
                result.label === "layak"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
                  result.label === "layak" ? "text-green-800" : "text-red-800"
                }`}
              >
                <FiCheckCircle className="w-6 h-6" />
                Hasil Analisis
              </h2>
              <div className="space-y-3 text-gray-800 text-base">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">📦 Kategori:</span>
                  <span>{result.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">🏷️ Label:</span>
                  <span
                    className={`font-semibold ${
                      result.label === "layak"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {result.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">🔍 Confidence:</span>
                  <span>{(result.confidence * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Info Section
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cara Kerja
            </h3>
            <p className="text-gray-600">
              Sistem kami menggunakan teknologi Machine Learning untuk
              menganalisis foto produk Anda. Kami akan memeriksa berbagai aspek
              seperti:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
              <li>Kesegaran produk</li>
              <li>Kondisi fisik</li>
              <li>Kualitas visual</li>
              <li>Kesesuaian standar pasar</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default QualityCheck;
