import { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { getCart } from "../services/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const data = await getCart(token);
      setCartItems(data); // Adjust based on the API response structure
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Handle remove item (placeholder)
  const handleRemoveFromCart = (itemId) => {
    // Implement remove logic here
    console.log(`Removed item ${itemId} from cart`);
  };

  if (loading) return <p className="text-center text-gray-500">Memuat keranjang...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!cartItems || cartItems.length === 0) return <p className="text-center text-gray-500">Keranjang kosong</p>;

  return (
    <div className="p-6 min-h-screen bg-[#F5F5DC]">
      <h2 className="text-3xl font-extrabold text-[#1C5532] mb-8 text-center drop-shadow">Keranjang Belanja</h2>
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={item.item.photoUrl || "https://via.placeholder.com/150"}
                alt={item.item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-bold text-[#1C5532]">{item.item.name}</h3>
                <p className="text-gray-500">Rp{item.item.basePrice.toLocaleString("id-ID")}</p>
                <p className="text-gray-500">Jumlah: {item.quantity}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveFromCart(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash className="text-2xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;