import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiLogOut, FiUser, FiMail, FiKey, FiPhone, FiMapPin, FiCopy } from "react-icons/fi";
import { getUserFromToken, addMerchant } from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [profileImage, setProfileImage] = useState("/src/assets/logo.jpeg");
  const [showAddToko, setShowAddToko] = useState(false);
  const [tokoForm, setTokoForm] = useState({ name: "", category: "", lat: "", lng: "", photo: null });
  const [tokoError, setTokoError] = useState("");
  const [tokoSuccess, setTokoSuccess] = useState("");
  const [token, setToken] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        navigate("/login");
        return;
      }

      setToken(storedToken);

      try {
        // Decode token untuk mendapatkan data user
        const userData = getUserFromToken(storedToken);
        if (!userData) {
          throw new Error("Token tidak valid");
        }

        // Set data user
        setUser({
          uid: userData.uid,
          email: userData.email,
          createdAt: new Date(userData.iat * 1000).toLocaleString(),
          displayName: userData.displayName || "Pengguna",
          role: userData.role || "user"
        });
        setEditedUser({
          uid: userData.uid,
          email: userData.email,
          createdAt: new Date(userData.iat * 1000).toLocaleString(),
          displayName: userData.displayName || "Pengguna",
          role: userData.role || "user"
        });
      } catch (e) {
        console.error("Error fetching profile:", e);
        setError("Gagal membaca data pengguna");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Dispatch custom event untuk logout
    window.dispatchEvent(new Event('logout'));
    navigate("/login");
  };

  const handleSave = () => {
    // Karena tidak ada endpoint untuk update profil, kita hanya update state lokal
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTokoChange = (e) => {
    const { name, value, files } = e.target;
    setTokoForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddToko = async (e) => {
    e.preventDefault();
    setTokoError("");
    setTokoSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await addMerchant(token, tokoForm);
      setTokoSuccess("Toko berhasil ditambahkan!");
      setTokoForm({ name: "", category: "", lat: "", lng: "", photo: null });
      setShowAddToko(false);
      // Redirect ke dashboard toko baru
      const merchantId = res.data?.id || res.id;
      if (merchantId) {
        navigate(`/dashboard-toko/${merchantId}`);
      }
    } catch (err) {
      setTokoError("Gagal menambah toko");
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopySuccess("Token berhasil disalin!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-32 bg-green-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
                  <FiEdit2 className="w-5 h-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-gray-800">Profil Pengguna</h2>
              <div className="flex flex-row gap-4 w-full sm:w-auto">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Simpan
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-none bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Edit Profil
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiUser className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Nama</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.displayName || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, displayName: e.target.value })}
                        className="border rounded-lg px-3 py-2 w-full"
                      />
                    ) : (
                      <p className="font-semibold">{user.displayName || "Belum diisi"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiMail className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiKey className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-semibold">{user.role || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 text-green-600 font-bold text-lg">⏰</span>
                  <div>
                    <p className="text-sm text-gray-500">Dibuat</p>
                    <p className="font-semibold">{user.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiKey className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 mb-1">Token</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                          {token}
                        </p>
                      </div>
                      <button
                        onClick={handleCopyToken}
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors flex-shrink-0"
                        title="Salin token"
                      >
                        <FiCopy />
                      </button>
                    </div>
                    {copySuccess && (
                      <p className="text-green-600 text-sm mt-1">{copySuccess}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiPhone className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Nomor Telepon</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phone || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                        className="border rounded-lg px-3 py-2 w-full"
                      />
                    ) : (
                      <p className="font-semibold">{user.phone || "Belum diisi"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiMapPin className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    {isEditing ? (
                      <textarea
                        value={editedUser.address || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                        className="border rounded-lg px-3 py-2 w-full"
                        rows="3"
                      />
                    ) : (
                      <p className="font-semibold">{user.address || "Belum diisi"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol tambah toko */}
            <div className="my-4">
              <button
                onClick={() => setShowAddToko(true)}
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
              >
                + Tambah Toko
              </button>
            </div>
            {/* Modal/Form tambah toko */}
            {showAddToko && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <form
                  onSubmit={handleAddToko}
                  className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative"
                >
                  <button
                    type="button"
                    onClick={() => setShowAddToko(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold mb-4 text-green-700">Tambah Toko</h3>
                  <div className="mb-3">
                    <label className="block mb-1 font-medium">Nama Toko</label>
                    <input type="text" name="name" value={tokoForm.name} onChange={handleTokoChange} required className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1 font-medium">Kategori</label>
                    <input type="text" name="category" value={tokoForm.category} onChange={handleTokoChange} required className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-3 flex gap-2">
                    <div className="flex-1">
                      <label className="block mb-1 font-medium">Latitude</label>
                      <input type="text" name="lat" value={tokoForm.lat} onChange={handleTokoChange} required className="w-full border rounded px-3 py-2" />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1 font-medium">Longitude</label>
                      <input type="text" name="lng" value={tokoForm.lng} onChange={handleTokoChange} required className="w-full border rounded px-3 py-2" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1 font-medium">Foto (opsional)</label>
                    <input type="file" name="photo" accept="image/*" onChange={handleTokoChange} className="w-full" />
                  </div>
                  {tokoError && <div className="text-red-600 mb-2 text-sm">{tokoError}</div>}
                  {tokoSuccess && <div className="text-green-700 mb-2 text-sm">{tokoSuccess}</div>}
                  <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 font-bold mt-2">Simpan</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
