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
      formData.append("image", selectedFile);

      const response = await fetch("https://pasarku-backend.vercel.app/api/quality-check", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal menganalisis kualitas produk");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
                  {preview ? "Klik untuk mengganti foto" : "Klik untuk memilih foto"}
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
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 flex items-center">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Result Section */}
          {result && (
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Hasil Analisis
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-gray-700">
                    Kualitas: {result.quality}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiInfo className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">
                    Rekomendasi: {result.recommendation}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cara Kerja
            </h3>
            <p className="text-gray-600">
              Sistem kami menggunakan teknologi Machine Learning untuk menganalisis foto produk Anda. 
              Kami akan memeriksa berbagai aspek seperti:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
              <li>Kesegaran produk</li>
              <li>Kondisi fisik</li>
              <li>Kualitas visual</li>
              <li>Kesesuaian standar pasar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityCheck; 