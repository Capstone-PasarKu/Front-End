import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiPackage,
  FiDollarSign,
  FiUsers,
  FiStar,
  FiEdit2,
  FiPlus,
  FiList,
} from "react-icons/fi";
import {
  getDashboardToko,
  getMerchantItems,
  getMerchants,
  getStock,
  addItem,
  updateItem,
  deleteItem,
  getUserFromToken,
  getMessages,
} from "../services/api";
import Swal from "sweetalert2";

const DashboardToko = () => {
  const { id } = useParams();
  const [merchant, setMerchant] = useState(null);
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    basePrice: "",
    photo: null,
    quantity: "",
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching data with token:", token, "and merchantId:", id);

        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        const user = getUserFromToken(token);
        if (!user) {
          throw new Error(
            "Token tidak valid atau kadaluarsa. Silakan login kembali."
          );
        }

        const merchantsData = await getMerchants(token, true);
        console.log("Merchants API Response:", merchantsData);
        const foundMerchant = merchantsData.find((m) => m.id === id);
        if (!foundMerchant) {
          throw new Error("Toko tidak ditemukan.");
        }
        setMerchant({
          id: foundMerchant.id,
          name: foundMerchant.name,
          category: foundMerchant.category,
        });

        const dashboardData = await getDashboardToko(token, id);
        console.log("Dashboard API Response:", dashboardData);

        const itemsData = await getMerchantItems(token, id);
        console.log("Items API Response:", itemsData);

        const stockData = await getStock(id);
        console.log("Stock API Response:", stockData);

        const topProducts = dashboardData.topProducts || [];
        const formattedProducts = Array.isArray(itemsData)
          ? itemsData.map((item) => {
              const topProduct = topProducts.find(
                (tp) => tp.item.toLowerCase() === item.name.toLowerCase()
              );
              const stockItem = stockData.find((s) => s.itemId === item.id);
              return {
                id: item.id,
                name: item.name,
                category: item.category || "",
                price: item.basePrice || 0,
                stock: stockItem
                  ? stockItem.quantity
                  : topProduct
                  ? topProduct.totalQuantity
                  : 0,
                is_active: true,
                image_url: item.photoUrl || "https://via.placeholder.com/40",
              };
            })
          : [];
        setProducts(formattedProducts);

        setStats({
          totalProducts: itemsData.length,
          totalOrders:
            (dashboardData.ordersByStatus?.completed || 0) +
            (dashboardData.ordersByStatus?.pending || 0),
          totalRevenue: dashboardData.totalSales || 0,
          averageRating: 0,
        });
        // Fetch messages with the updated function
        const messagesData = await getMessages(token, id);
        setMessages(messagesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files ? files[0] : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const confirmationMessage = isEditMode
      ? `Apakah Anda yakin ingin memperbarui produk "${formData.name}"?`
      : `Apakah Anda yakin ingin menambahkan produk "${formData.name}"?`;

    const result = await Swal.fire({
      title: "Konfirmasi",
      text: confirmationMessage,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    if (!formData.name || formData.name.trim() === "") {
      setFormError("Nama produk tidak boleh kosong.");
      return;
    }
    if (!formData.category) {
      setFormError("Kategori harus dipilih.");
      return;
    }
    if (!formData.basePrice || Number(formData.basePrice) < 1000) {
      setFormError("Harga harus lebih besar dari atau sama dengan 1000.");
      return;
    }
    if (
      !formData.quantity ||
      Number(formData.quantity) <= 0 ||
      isNaN(Number(formData.quantity))
    ) {
      setFormError("Stok harus berupa angka positif lebih besar dari 0.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      const user = getUserFromToken(token);
      if (!user) {
        throw new Error(
          "Token tidak valid atau kadaluarsa. Silakan login kembali."
        );
      }

      const existingProduct = products.find(
        (product) =>
          product.name.toLowerCase() === formData.name.toLowerCase() &&
          !isEditMode
      );
      if (existingProduct) {
        setFormError("Nama barang sudah ada. Silakan gunakan nama lain.");
        return;
      }

      const itemData = {
        merchantId: id,
        name: formData.name.trim(),
        category: formData.category,
        basePrice: formData.basePrice,
        quantity: formData.quantity,
        photo: formData.photo || null,
      };

      console.log("Data yang akan dikirim:", itemData);

      let response;
      if (isEditMode) {
        response = await updateItem(token, currentItemId, itemData);
        console.log("Update Item API Response:", response);

        setProducts(
          products.map((product) =>
            product.id === currentItemId
              ? {
                  ...product,
                  name: formData.name.trim(),
                  category: formData.category,
                  price: Number(formData.basePrice),
                  stock: Number(formData.quantity),
                  image_url: response.photoUrl || product.image_url,
                }
              : product
          )
        );
        setFormSuccess("Barang berhasil diperbarui!");
      } else {
        response = await addItem(token, itemData);
        console.log("Add Item API Response:", response);

        const itemsData = await getMerchantItems(token, id);
        const dashboardData = await getDashboardToko(token, id);
        const stockData = await getStock(id);
        const topProducts = dashboardData.topProducts || [];

        const formattedProducts = Array.isArray(itemsData)
          ? itemsData.map((item) => {
              const topProduct = topProducts.find(
                (tp) => tp.item.toLowerCase() === item.name.toLowerCase()
              );
              const stockItem = stockData.find((s) => s.itemId === item.id);
              return {
                id: item.id,
                name: item.name,
                category: item.category || "",
                price: item.basePrice || 0,
                stock: stockItem
                  ? stockItem.quantity
                  : topProduct
                  ? topProduct.totalQuantity
                  : 0,
                is_active: true,
                image_url: item.photoUrl || "https://via.placeholder.com/40",
              };
            })
          : [];

        setProducts(formattedProducts);
        setStats({
          totalProducts: itemsData.length,
          totalOrders:
            (dashboardData.ordersByStatus?.completed || 0) +
            (dashboardData.ordersByStatus?.pending || 0),
          totalRevenue: dashboardData.totalSales || 0,
          averageRating: 0,
        });

        setFormSuccess("Barang berhasil ditambahkan!");
      }

      setFormData({
        name: "",
        category: "",
        basePrice: "",
        photo: null,
        quantity: "",
      });
      setIsModalOpen(false);
      setIsEditMode(false);
      setCurrentItemId(null);
    } catch (err) {
      console.error("Error processing item:", err);
      setFormError(
        "Gagal memproses barang: " + (err.message || "Unknown error")
      );
    }
  };

  const handleEditClick = (product) => {
    setIsEditMode(true);
    setCurrentItemId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      basePrice: product.price.toString(),
      photo: null,
      quantity: product.stock.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (itemId) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus barang ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      const user = getUserFromToken(token);
      if (!user) {
        throw new Error(
          "Token tidak valid atau kadaluarsa. Silakan login kembali."
        );
      }

      const response = await deleteItem(token, itemId);
      console.log("Delete Item API Response:", response);

      setProducts(products.filter((product) => product.id !== itemId));
      setStats((prevStats) => ({
        ...prevStats,
        totalProducts: prevStats.totalProducts - 1,
      }));
    } catch (err) {
      console.error("Error deleting item:", err);
      await Swal.fire({
        title: "Error",
        text: "Gagal menghapus barang: " + (err.message || "Unknown error"),
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F5DC]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F5DC]">
        <div className="bg-white p-6 rounded-2xl shadow-xl text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {merchant?.name || "Nama Toko Kosong"}
              </h1>
              <p className="text-gray-600">
                {merchant?.category || "Kategori Kosong"}
              </p>
            </div>
            <div className="flex space-x-4">
              {/* <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <FiEdit2 className="mr-2" />
                Edit Toko
              </button> */}
              <Link
                to={`/dashboard-toko/${id}/orders`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FiList className="mr-2" />
                Daftar Pesanan
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Produk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Pesanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiStar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Rating Rata-rata</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Pesan dari Pengguna
            </h2>
          </div>
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{msg.message}</p>
                  <p className="text-sm text-gray-500">ID: {msg.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Belum ada pesan.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Daftar Produk</h2>
            <button
              onClick={() => {
                setIsEditMode(false);
                setFormData({
                  name: "",
                  category: "",
                  basePrice: "",
                  photo: null,
                  quantity: "",
                });
                setIsModalOpen(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <FiPlus className="mr-2" />
              Tambah Produk
            </button>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>
                {formError && (
                  <div className="text-red-600 mb-4">{formError}</div>
                )}
                {formSuccess && (
                  <div className="text-green-600 mb-4">{formSuccess}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Produk
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring focus:ring-green-600 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Kategori
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring focus:ring-green-600 focus:ring-opacity-50"
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Buah">Buah</option>
                      <option value="Sayur">Sayur</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Rempah">Rempah</option>
                      <option value="Daging">Daging</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring focus:ring-green-600 focus:ring-opacity-50"
                      required
                      min="1000"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Stok Awal
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (!isNaN(value) && Number(value) >= 0)
                        ) {
                          handleInputChange(e);
                        }
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring focus:ring-green-600 focus:ring-opacity-50"
                      required
                      min="1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Gambar Produk
                    </label>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-600 file:text-white file:hover:bg-green-700"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsEditMode(false);
                        setCurrentItemId(null);
                        setFormData({
                          name: "",
                          category: "",
                          basePrice: "",
                          photo: null,
                          quantity: "",
                        });
                      }}
                      className="mr-2 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              product.image_url ||
                              "https://via.placeholder.com/40"
                            }
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Rp {product.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardToko;
