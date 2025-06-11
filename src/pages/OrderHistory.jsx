import React, { useState, useEffect } from 'react';
import { getBuyerOrders, getMerchants } from "../services/api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [merchants, setMerchants] = useState({}); // State untuk menyimpan data merchant per merchantId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil token dari localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrdersAndMerchants = async () => {
      try {
        setLoading(true);
        if (!token) throw new Error("Token autentikasi tidak ditemukan");

        // Ambil data pesanan
        const orderData = await getBuyerOrders(token);
        setOrders(orderData);

        // Ambil data merchant untuk setiap merchantId unik
        const merchantIds = [...new Set(orderData.map(order => order.merchantId))];
        const merchantPromises = merchantIds.map(merchantId =>
          getMerchants(token).then(data => ({ [merchantId]: data.find(m => m.id === merchantId) || null }))
        );
        const merchantResults = await Promise.all(merchantPromises);
        const merchantMap = merchantResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setMerchants(merchantMap);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchOrdersAndMerchants();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#F5F5DC]">
      <div className="max-w-2xl mx-auto"> {/* Mengubah max-w-4xl menjadi max-w-2xl untuk membatasi lebar */}
        <h1 className="text-2xl font-bold mb-6">Riwayat Pesanan</h1>
        {orders.length === 0 ? (
          <p className="text-gray-500">Belum ada pesanan.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const merchant = merchants[order.merchantId] || { name: 'Toko Tidak Ditemukan' };
              return (
                <div
                  key={order.id}
                  className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{order.item}</h2>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Toko: {merchant.name}</p> {/* Tambahkan nama toko di sini */}
                    <p>Order ID: {order.id}</p>
                    <p>Jumlah: {order.quantity}</p>
                    <p>Harga Satuan: Rp {order.price.toLocaleString()}</p>
                    <p>Total: Rp {order.total.toLocaleString()}</p>
                    <p>Metode Pengiriman: {order.deliveryMethod}</p>
                    <p>Metode Pembayaran: {order.paymentMethod}</p>
                    {order.address && <p>Alamat: {order.address}</p>}
                    <p>Tanggal: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;