import axios from "axios";

const API_URL = "https://pasarku-backend.vercel.app/api";

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/product/search`);
  if (!res.ok) throw new Error("Gagal mencari produk");
  return res.json();
};

export const registerUser = async ({ email, password, name, phoneNumber, address }) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("phoneNumber", phoneNumber);
  formData.append("address", address);

  try {
    console.log("Sending registration data:", { email, password, name, phoneNumber, address });
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Register gagal (HTTP ${res.status})`);
    }
    return res.json();
  } catch (err) {
    throw new Error(err.message || "Register gagal. Periksa data yang Anda masukkan.");
  }
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
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.error("Token has expired");
      localStorage.removeItem("token");
      return null;
    }
    console.log("Decoded token payload:", decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil profil");
  return res.json();
};

export const addMerchant = async (token, merchantData) => {
  const formData = new FormData();
  Object.keys(merchantData).forEach((key) => {
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
  const url = `${API_URL}/dashboard?merchantId=${merchantId}`;
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
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
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
  Object.keys(orderData).forEach((key) => {
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
  try {
    console.log("Original itemData:", itemData);
    
    // Buat FormData baru
    const formData = new FormData();
    
    // Append data satu per satu dengan validasi
    if (itemData.merchantId) {
      formData.append('merchantId', itemData.merchantId);
    }
    if (itemData.name) {
      formData.append('name', itemData.name.trim());
    }
    if (itemData.category) {
      formData.append('category', itemData.category);
    }
    if (itemData.basePrice) {
      formData.append('basePrice', itemData.basePrice.toString());
    }
    if (itemData.quantity) {
      // Pastikan quantity dikirim sebagai string angka yang valid
      const qty = parseInt(itemData.quantity);
      if (!isNaN(qty) && qty > 0) {
        formData.append('quantity', qty.toString());
      } else {
        throw new Error('Quantity harus berupa angka positif');
      }
    }
    if (itemData.photo && itemData.photo instanceof File) {
      formData.append('photo', itemData.photo);
    }

    // Debug: tampilkan semua data yang akan dikirim
    console.log("FormData keys:", Array.from(formData.keys()));
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`${API_URL}/item`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type untuk FormData, biarkan browser yang set otomatis
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error response:", errorData);
      throw new Error(errorData.error || errorData.message || "Gagal menambah barang");
    }

    const result = await response.json();
    console.log("Success response:", result);
    return result;
    
  } catch (error) {
    console.error("Failed to add item:", error);
    throw error;
  }
};

export const addToCart = async (token, cartData) => {
  const formData = new FormData();
  Object.keys(cartData).forEach((key) => {
    formData.append(key, cartData[key]);
  });

  const res = await fetch(`${API_URL}/api/cart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Gagal menambah barang ke keranjang");
  }

  return res.json();
};

export const getCart = async (token) => {
  const res = await fetch(`${API_URL}/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil keranjang");
  return res.json();
};

export const updateItem = async (token, itemId, itemData) => {
  const formData = new FormData();
  Object.keys(itemData).forEach((key) => {
    if (itemData[key] !== null && itemData[key] !== undefined) {
      formData.append(key, itemData[key]);
    }
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
  Object.keys(stockData).forEach((key) => {
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

// Tambahan fungsi baru untuk mengirim pesan
export const sendMessage = async (token, { storeName, message }) => {
  const res = await fetch(`${API_URL}/send-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ storeName, message }),
  });
  if (!res.ok) throw new Error("Gagal mengirim pesan");
  return res.json();
};


export const getMessages = async (token, merchantId) => {
  const res = await fetch(`${API_URL}/merchant/messages?merchantId=${merchantId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Gagal memuat pesan");
  return res.json();
};