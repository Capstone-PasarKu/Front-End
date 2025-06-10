import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUser,
  FiMail,
  FiKey,
  FiPhone,
  FiMapPin,
  FiCopy,
} from "react-icons/fi";
import { getUserFromToken, getProfile, addMerchant } from "../services/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState("/src/assets/logo.jpeg");
  const [showAddToko, setShowAddToko] = useState(false);
  const [hasStore, setHasStore] = useState(false);
  const [tokoForm, setTokoForm] = useState({
    name: "",
    category: "",
    lat: "",
    lon: "",
    photo: null,
    norek: "",
  });
  const [tokoError, setTokoError] = useState("");
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
      setLoading(true);
      setError("");

      try {
        const userData = getUserFromToken(storedToken);
        if (!userData) {
          throw new Error("Token tidak valid atau kedaluwarsa");
        }
        console.log("Token user data:", userData);

        let profileData = {};
        try {
          profileData = await getProfile(storedToken);
          console.log("Profile API response:", profileData);
        } catch (e) {
          console.warn("Failed to fetch profile from API:", e.message);
        }

        const mergedUserData = {
          uid: userData.uid || userData.sub || "unknown",
          email: userData.email || profileData.email || "Email tidak tersedia",
          createdAt: new Date(userData.iat * 1000).toLocaleString(),
          displayName: profileData.name || userData.displayName || userData.name || "Pengguna",
          role: userData.role || profileData.role || "user",
          phone: profileData.phoneNumber || profileData.phone || "",
          address: profileData.address || "",
        };

        setUser(mergedUserData);

        try {
          const response = await fetch("https://pasarku-backend.vercel.app/api/merchants?owned=true", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (!response.ok) throw new Error("Gagal memeriksa status toko");
          const data = await response.json();
          setHasStore(data.length > 0);
        } catch (e) {
          console.error("Error checking store status:", e);
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
        setError("Gagal membaca data pengguna: " + e.message);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    let map, marker;
    if (showAddToko) {
      // Request geolocation when the form is opened
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setTokoForm((prev) => ({
            ...prev,
            lat: latitude.toString(),
            lon: longitude.toString(),
          }));

          // Initialize map with user's location
          map = L.map("map").setView([latitude, longitude], 13);

          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);

          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          });

          marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);

          marker.on("dragend", function (event) {
            const position = event.target.getLatLng();
            setTokoForm((prev) => ({
              ...prev,
              lat: position.lat.toString(),
              lon: position.lng.toString(),
            }));
          });

          map.on("click", function (e) {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            setTokoForm((prev) => ({
              ...prev,
              lat: lat.toString(),
              lon: lng.toString(),
            }));
          });
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          // Fallback to default location if geolocation fails
          const initialLatLng = [-2.972545, 104.774436];
          setTokoForm((prev) => ({
            ...prev,
            lat: initialLatLng[0].toString(),
            lon: initialLatLng[1].toString(),
          }));

          map = L.map("map").setView(initialLatLng, 13);

          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);

          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          });

          marker = L.marker(initialLatLng, { draggable: true }).addTo(map);

          marker.on("dragend", function (event) {
            const position = event.target.getLatLng();
            setTokoForm((prev) => ({
              ...prev,
              lat: position.lat.toString(),
              lon: position.lng.toString(),
            }));
          });

          map.on("click", function (e) {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            setTokoForm((prev) => ({
              ...prev,
              lat: lat.toString(),
              lon: lng.toString(),
            }));
          });

          Swal.fire({
            title: "Lokasi Tidak Diizinkan",
            text: "Akses lokasi ditolak. Gunakan lokasi default atau pilih lokasi secara manual di peta.",
            icon: "warning",
            confirmButtonColor: "#15803d",
            confirmButtonText: "OK",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [showAddToko]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
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

    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) throw new Error("Token tidak ditemukan");

      if (
        !tokoForm.name ||
        !tokoForm.category ||
        !tokoForm.lat ||
        !tokoForm.lon ||
        !tokoForm.norek
      ) {
        throw new Error("Semua field wajib diisi kecuali foto");
      }

      const merchantData = {
        name: tokoForm.name,
        category: tokoForm.category,
        lat: tokoForm.lat,
        lng: tokoForm.lon,
        photo: tokoForm.photo,
        norek: tokoForm.norek,
      };

      console.log("Sending merchant data:", merchantData);
      const result = await addMerchant(storedToken, merchantData);
      console.log("API Response:", result);

      Swal.fire({
        title: "Berhasil!",
        text: "Toko berhasil ditambahkan!",
        icon: "success",
        confirmButtonColor: "#15803d",
        confirmButtonText: "OK",
      }).then(() => {
        setTokoForm({ name: "", category: "", lat: "", lon: "", photo: null, norek: "" });
        setShowAddToko(false);
        setHasStore(true);

        const merchantId = result.data?.id || result.id || result.merchantId;
        if (merchantId) {
          navigate(`/dashboard-toko/${merchantId}`);
        } else {
          throw new Error("ID toko tidak ditemukan dalam respons");
        }
      });
    } catch (err) {
      console.error("Error adding merchant:", err);
      setTokoError("Gagal menambah toko: " + (err.message || "Unknown error"));
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopySuccess("Token berhasil disalin!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleShowAddToko = () => {
    Swal.fire({
      title: "Tambah Toko Baru",
      text: "Apakah Anda yakin ingin menambahkan toko baru?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#b91c1c",
      confirmButtonText: "Ya, Tambah",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setShowAddToko(true);
      }
    });
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
        <div className="bg-white p-8 rounded-2xl shadow-xl text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("User state is null");
    return null;
  }

  console.log("Rendering user state:", user);

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-32 bg-green-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Profil Pengguna
              </h2>
              <div className="flex flex-row gap-4 w-full sm:w-auto">
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
                    <p className="font-semibold">
                      {user.displayName || "Belum diisi"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiMail className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">
                      {user.email || "Email tidak tersedia"}
                    </p>
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
                  <span className="w-6 h-6 text-green-600 font-bold text-lg">
                    ⏰
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Masuk</p>
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
                      <p className="text-green-600 text-sm mt-1">
                        {copySuccess}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiPhone className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Nomor Telepon</p>
                    <p className="font-semibold">
                      {user.phone || "Belum diisi"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiMapPin className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-semibold">
                      {user.address || "Belum diisi"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!hasStore && (
              <div className="my-4">
                <button
                  onClick={handleShowAddToko}
                  className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
                >
                  + Tambah Toko
                </button>
              </div>
            )}

            {showAddToko && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <form
                  onSubmit={handleAddToko}
                  className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative"
                >
                  <button
                    type="button"
                    onClick={() => setShowAddToko(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
                  >
                    ×
                  </button>
                  <h3 className="text-lg font-bold mb-3">Tambah Toko</h3>
                  <div className="mb-2">
                    <label className="block mb-1 font-medium text-sm">
                      Nama Toko
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={tokoForm.name}
                      onChange={handleTokoChange}
                      required
                      className="w-full border rounded px-2 py-1 text-sm bg-white text-black"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 font-medium text-sm">
                      Kategori
                    </label>
                    <select
                      name="category"
                      value={tokoForm.category}
                      onChange={handleTokoChange}
                      required
                      className="w-full border rounded px-2 py-1 text-sm bg-white text-black"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Buah">Buah</option>
                      <option value="Sayur">Sayur</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Rempah">Rempah</option>
                      <option value="Daging">Daging</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 font-medium text-sm">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      name="norek"
                      value={tokoForm.norek}
                      onChange={handleTokoChange}
                      required
                      className="w-full border rounded px-2 py-1 text-sm bg-white text-black"
                      placeholder="Masukkan nomor rekening"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 font-medium text-sm">
                      Lokasi Toko
                    </label>
                    <div id="map" style={{ height: "150px" }}></div>
                  </div>
                  <div className="mb-2 flex gap-2">
                    <div className="flex-1">
                      <label className="block mb-1 font-medium text-sm">
                        Latitude
                      </label>
                      <input
                        type="text"
                        name="lat"
                        value={tokoForm.lat}
                        onChange={handleTokoChange}
                        required
                        className="w-full border rounded px-2 py-1 text-sm bg-white text-black"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1 font-medium text-sm">
                        Longitude
                      </label>
                      <input
                        type="text"
                        name="lon"
                        value={tokoForm.lon}
                        onChange={handleTokoChange}
                        required
                        className="w-full border rounded px-2 py-1 text-sm bg-white text-black"
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 font-medium text-sm">
                      Foto (opsional)
                    </label>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleTokoChange}
                      className="w-full text-sm bg-white text-black"
                    />
                  </div>
                  {tokoError && (
                    <div className="text-red-600 mb-2 text-sm">{tokoError}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-1 rounded-lg hover:bg-green-800 text-sm font-bold mt-2"
                  >
                    Simpan
                  </button>
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