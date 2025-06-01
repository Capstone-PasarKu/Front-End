import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const res = await registerUser(form.email, form.password);
      setSuccess("Register berhasil! Silakan login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Register gagal. Email mungkin sudah terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
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
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-green-800 font-semibold mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-green-800 font-semibold mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition mb-3 shadow disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>
        {error && (
          <div className="text-red-600 text-center text-sm mb-2">{error}</div>
        )}
        {success && (
          <div className="text-green-700 text-center text-sm mb-2">
            {success}
          </div>
        )}
        <div className="text-center text-sm text-green-800">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Masuk
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;
