import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.token);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError("Email atau password salah");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5DC]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-green-600 animate-fade-in"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://res.cloudinary.com/dtaeoc9tu/image/upload/v1749661093/logo_qp2se4.jpg"
            alt="Logo"
            className="w-16 h-16 rounded-full mb-2 border-2 border-green-600 shadow"
          />
          <h2 className="text-2xl font-extrabold text-green-700 tracking-tight">
            Masuk ke Pasarku
          </h2>
          <p className="text-green-800 text-sm mt-1">
            Masukkan email dan password Anda
          </p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Masukkan password Anda"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-center text-sm mb-4">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition mb-3 shadow disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </div>
          ) : (
            "Masuk"
          )}
        </button>

        <div className="text-center text-sm text-green-800">
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-green-700 font-semibold hover:underline"
          >
            Daftar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;