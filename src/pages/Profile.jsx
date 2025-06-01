import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiLogOut, FiUser, FiMail, FiKey, FiPhone, FiMapPin } from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [profileImage, setProfileImage] = useState("/src/assets/logo.jpeg");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // Decode JWT payload (base64) to get user info
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
      setEditedUser(payload);
    } catch (e) {
      setError("Gagal membaca data pengguna");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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

  const handleSave = () => {
    // Here you would typically make an API call to update the user data
    setUser(editedUser);
    setIsEditing(false);
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 py-12 px-4 sm:px-6 lg:px-8">
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
                        value={editedUser.name || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        className="border rounded-lg px-3 py-2 w-full"
                      />
                    ) : (
                      <p className="font-semibold">{user.name || "Belum diisi"}</p>
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
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-semibold">{user.uid}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
