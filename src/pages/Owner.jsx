import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, UpdateStatusOwner } from "../services/api";
import { getProfile } from "../services/api"; // For role checking
import Swal from "sweetalert2";
import { FiTruck, FiXCircle, FiCheckCircle } from "react-icons/fi";

const Owner = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        console.log("No token found, redirecting to /login");
        navigate("/login");
        return;
      }

      try {
        const profileData = await getProfile(token);
        console.log("Profile data:", profileData);
        if (profileData.role !== "owner") {
          console.log("User is not owner, redirecting to /");
          navigate("/");
          return;
        }

        const ordersData = await getAllOrders(token);
        console.log("Orders data:", ordersData);
        if (!Array.isArray(ordersData)) {
          throw new Error("Invalid orders data format");
        }
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err.message, err.response?.data);
        setError(`Gagal mengambil daftar pesanan: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    const orderToUpdate = orders.find((order) => order.id === orderId);
    if (!orderToUpdate) return;

    // Only allow change from "konfirmasi pembayaran" to "pending"
    if (orderToUpdate.status !== "konfirmasi pembayaran" || newStatus !== "pending") {
      await Swal.fire({
        title: "Error",
        text: "Hanya dapat mengubah status dari 'konfirmasi pembayaran' menjadi 'pending'",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda yakin ingin mengubah status pesanan menjadi "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      console.log(`Updating status for orderId: ${orderId} to ${newStatus} with token: ${token}`);
      const res = await UpdateStatusOwner(token, orderId, newStatus);
      console.log("Update response:", res);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
        )
      );

      await Swal.fire({
        title: "Sukses",
        text: "Status pesanan berhasil diperbarui",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });

      // Removed redirect to dashboard, stay on the same page
      // navigate(`/dashboard-toko/${merchantId}`);
    } catch (err) {
      console.error("Error updating order status:", err.message, err.response?.data);
      await Swal.fire({
        title: "Error",
        text: `Gagal mengubah status pesanan: ${err.message} (HTTP ${err.response?.status || "Unknown"})`,
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
        <div className="bg-white p-6 rounded-2xl shadow-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6" style={{ backgroundColor: "#fefcbf" }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar Semua Pesanan</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metode
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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.item}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.deliveryMethod}</div>
                      <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-red-100 text-red-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "konfirmasi pembayaran"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.status === "konfirmasi pembayaran" ? (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value, order.merchantId)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring focus:ring-green-600 focus:ring-opacity-50"
                        >
                          <option value="konfirmasi pembayaran">Konfirmasi Pembayaran</option>
                          <option value="pending">Pending</option>
                        </select>
                      ) : (
                        <span className="text-gray-500">Tidak dapat diubah</span>
                      )}
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

export default Owner;