import axios from "axios";

const API_URL = "https://pasarku-backend.vercel.app/api";

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/product/search`);
  const data = await res.json();
  return data;
};

export const registerUser = async (email, password) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Register gagal");
  return res.json();
};

export const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Login gagal");
  return res.json();
};

export const getUserFromToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const addMerchant = async (token, merchantData) => {
  const formData = new FormData();
  Object.keys(merchantData).forEach(key => {
    formData.append(key, merchantData[key]);
  });

  const res = await fetch(`${API_URL}/merchant`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Gagal menambah toko");
  return res.json();
};

export const getDashboardToko = async (token, merchantId) => {
  const url = `https://pasarku-backend.vercel.app/api/dashboard?merchantId=${merchantId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil dashboard toko");
  return res.json();
};

export const getMerchants = async (token, owned = false) => {
  const url = owned ? `${API_URL}/merchants?owned=true` : `${API_URL}/merchants`;
  const res = await fetch(url, {
    method: "GET",
    headers: token ? {
      Authorization: `Bearer ${token}`,
    } : {},
  });
  if (!res.ok) throw new Error("Gagal mengambil daftar toko");
  return res.json();
};

export const getMerchantItems = async (token, merchantId) => {
  const res = await fetch(`${API_URL}/items?merchantId=${merchantId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil daftar barang");
  return res.json();
};

export const getStock = async (merchantId) => {
  const res = await fetch(`${API_URL}/stock?merchantId=${merchantId}`);
  if (!res.ok) throw new Error("Gagal mengambil stok");
  return res.json();
};

export const searchProducts = async (name = "", sortBy = "termurah") => {
  const url = new URL(`${API_URL}/product/search`);
  if (name) url.searchParams.append("name", name);
  url.searchParams.append("sortBy", sortBy);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mencari produk");
  return res.json();
};

export const createOrder = async (token, orderData) => {
  const formData = new FormData();
  Object.keys(orderData).forEach(key => {
    formData.append(key, orderData[key]);
  });

  const res = await fetch(`${API_URL}/order`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Gagal membuat pesanan");
  return res.json();
};

export const getBuyerOrders = async (token) => {
  const res = await fetch(`${API_URL}/order`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil daftar pesanan");
  return res.json();
};

export const addItem = async (token, itemData) => {
  const formData = new FormData();
  Object.keys(itemData).forEach(key => {
    formData.append(key, itemData[key]);
  });

  const res = await fetch(`${API_URL}/item`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Gagal menambah barang");
  return res.json();
};

export const updateItem = async (token, itemId, itemData) => {
  const formData = new FormData();
  Object.keys(itemData).forEach(key => {
    formData.append(key, itemData[key]);
  });

  const res = await fetch(`${API_URL}/item/${itemId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Gagal update barang");
  return res.json();
};

export const deleteItem = async (token, itemId) => {
  const res = await fetch(`${API_URL}/item/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Gagal hapus barang");
  return res.json();
};

export const updateStock = async (token, stockData) => {
  const formData = new FormData();
  Object.keys(stockData).forEach(key => {
    formData.append(key, stockData[key]);
  });

  const res = await fetch(`${API_URL}/stock`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Gagal update stok");
  return res.json();
};

export const getMerchantOrders = async (token, merchantId) => {
  const res = await fetch(`${API_URL}/merchant/orders?merchantId=${merchantId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil daftar pesanan");
  return res.json();
};

export const updateOrderStatus = async (token, orderId, status) => {
  const res = await fetch(`${API_URL}/order/${orderId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Gagal update status pesanan");
  return res.json();
};

export const getMerchantDashboard = async (token, merchantId) => {
  const res = await fetch(`${API_URL}/dashboard?merchantId=${merchantId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil dashboard");
  return res.json();
};