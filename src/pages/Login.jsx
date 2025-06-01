import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    window.dispatchEvent(new Event("storage")); // force Navbar to update isLoggedIn
    navigate("/profile");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(email, password);
      // Simpan token jika ada, lalu redirect
      if (res.token) {
        localStorage.setItem("token", res.token);
        handleLoginSuccess();
      } else {
        setError(res.message || "Login gagal");
      }
    } catch (err) {
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-green-600 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <img src="/src/assets/logo.jpeg" alt="Logo" className="w-16 h-16 rounded-full mb-2 border-2 border-green-600 shadow" />
          <h2 className="text-2xl font-extrabold text-green-700 tracking-tight">Masuk ke Pasarku</h2>
          <p className="text-green-800 text-sm mt-1">Silakan login untuk melanjutkan</p>
        </div>
        <div className="mb-4">
          <label className="block text-green-800 font-semibold mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-green-800 font-semibold mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
        </div>
        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
        <button type="submit" className={`w-full ${loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"} text-white font-bold py-3 rounded transition mb-3 shadow`} disabled={loading}>
          {loading ? "Sedang masuk..." : "Masuk"}
        </button>
        <div className="text-center text-sm text-green-800">
          Belum punya akun? <a href="/register" className="text-green-700 font-semibold hover:underline">Daftar</a>
        </div>
      </form>
    </div>
  );
};

export default Login;