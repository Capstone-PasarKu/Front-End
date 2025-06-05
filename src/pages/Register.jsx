import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin } from "react-icons/fi";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", address: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        password: form.password,
      });
      setSuccess("Register berhasil! Silakan login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Register gagal. Email mungkin sudah terdaftar atau data tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5DC]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-green-600 animate-fade-in"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src="/src/assets/logo.jpeg"
            alt="Logo"
            className="w-16 h-16 rounded-full mb-2 border-2 border-green-600 shadow"
          />
          <h2 className="text-2xl font-extrabold text-green-700 tracking-tight">
            Daftar Akun Pasarku
          </h2>
          <p className="text-green-800 text-sm mt-1">
            Isi data di bawah untuk membuat akun
          </p>
        </div>
        <div className="mb-4">
          <label
            className="block text-green-800 font-semibold mb-1"
            htmlFor="name"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-green-600" />
            </div>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-green-800 font-semibold mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-green-600" />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Masukkan email Anda"
            />
          </div>
        </div>
        <div className="mb-6">
          <label
            className="block text-green-800 font-semibold mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-green-600" />
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Masukkan password Anda"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-green-800 font-semibold mb-1"
            htmlFor="phoneNumber"
          >
            Nomor Telepon
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="h-5 w-5 text-green-600" />
            </div>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Masukkan nomor telepon Anda"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-green-800 font-semibold mb-1"
            htmlFor="address"
          >
            Alamat
          </label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <FiMapPin className="h-5 w-5 text-green-600" />
            </div>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows="4"
              className="w-full pl-10 px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-y"
              placeholder="Masukkan alamat Anda"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition mb-3 shadow-sm disabled:opacity-60"
          disabled={loading}
          aria-label={loading ? "Mendaftar" : "Daftar"}
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>
        {error && (
          <div className="text-red-600 text-center text-sm mb-2">{error}</div>
        )}
        {success && (
          <div className="text-green-700 text-center text-sm mb-2">{success}</div>
        )}
        <div className="text-center text-sm text-green-800">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Masuk
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;