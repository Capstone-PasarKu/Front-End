import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { searchProducts, createOrder } from "../services/api"; // Sesuaikan path ke file API service

const ProductDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [orderData, setOrderData] = useState({
		quantity: 1,
		deliveryMethod: "antar",
		paymentMethod: "cod",
		address: "",
	});
	const [orderError, setOrderError] = useState(null);
	const [orderSuccess, setOrderSuccess] = useState(false);

	// Ambil detail produk berdasarkan id
	const fetchProduct = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await searchProducts();
			const foundProduct = data.find((item) => item.id === id);
			if (!foundProduct) throw new Error("Produk tidak ditemukan");
			setProduct({
				id: foundProduct.id,
				name: foundProduct.item.name,
				price: foundProduct.item.basePrice,
				image: foundProduct.merchant.photoUrl || "https://via.placeholder.com/300",
				description: `Dijual oleh ${foundProduct.merchant.name} - Kategori: ${foundProduct.item.category}`,
				category: foundProduct.item.category,
				stock: foundProduct.quantity,
				merchantId: foundProduct.merchantId,
			});
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProduct();
	}, [id]);

	// Handle perubahan form pesanan
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setOrderData((prev) => ({
			...prev,
			[name]: name === "quantity" ? parseInt(value) : value,
		}));
	};

	// Handle submit pesanan
	const handleOrderSubmit = async (e) => {
		e.preventDefault();
		setOrderError(null);
		setOrderSuccess(false);

		const token = localStorage.getItem("token");
		if (!token) {
			setOrderError("Harap login terlebih dahulu!");
			return;
		}

		if (orderData.deliveryMethod === "antar" && !orderData.address.trim()) {
			setOrderError("Alamat harus diisi untuk pengiriman!");
			return;
		}

		if (orderData.quantity < 1 || orderData.quantity > product.stock) {
			setOrderError(`Jumlah harus antara 1 dan ${product.stock}`);
			return;
		}

		try {
			const orderPayload = {
				itemId: product.id,
				merchantId: product.merchantId,
				quantity: orderData.quantity,
				deliveryMethod: orderData.deliveryMethod,
				paymentMethod: orderData.paymentMethod,
				...(orderData.deliveryMethod === "antar" && { address: orderData.address }),
			};
			await createOrder(token, orderPayload);
			setOrderSuccess(true);
			setTimeout(() => navigate("/order"), 2000); // Arahkan ke halaman pesanan (sesuaikan rute)
		} catch (err) {
			setOrderError(err.message);
		}
	};

	if (loading) return <p className="text-center text-gray-600">Memuat...</p>;
	if (error) return <p className="text-center text-red-600">Error: {error}</p>;

	return (
		<div className="p-6 min-h-screen bg-[#F5F5DC]">
			<div className="container mx-auto max-w-4xl">
				<h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center drop-shadow">
					Detail Produk
				</h1>

				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
					{/* Gambar Produk */}
					<img
						src={product.image}
						alt={product.name}
						className="w-full md:w-1/2 h-64 object-cover rounded-lg border"
					/>

					{/* Detail Produk */}
					<div className="flex-1 flex flex-col">
						<h2 className="text-2xl font-bold text-green-800 mb-2">
							{product.name}
						</h2>
						<p className="text-gray-600 dark:text-gray-300 mb-2">
							{product.description}
						</p>
						<p className="text-green-700 font-semibold text-xl mb-2">
							Rp{product.price.toLocaleString("id-ID")}
						</p>
						<p className="text-gray-600 dark:text-gray-300 mb-4">
							Stok: {product.stock}
						</p>

						{/* Form Pesanan */}
						<form onSubmit={handleOrderSubmit} className="flex flex-col gap-4">
							<div>
								<label className="text-sm font-medium text-gray-700 dark:text-gray-200">
									Jumlah:
								</label>
								<input
									type="number"
									name="quantity"
									value={orderData.quantity}
									onChange={handleInputChange}
									min="1"
									max={product.stock}
									className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
								/>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700 dark:text-gray-200">
									Metode Pengiriman:
								</label>
								<select
									name="deliveryMethod"
									value={orderData.deliveryMethod}
									onChange={handleInputChange}
									className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
								>
									<option value="antar">Antar</option>
									<option value="ambil">Ambil Sendiri</option>
								</select>
							</div>

							{orderData.deliveryMethod === "antar" && (
								<div>
									<label className="text-sm font-medium text-gray-700 dark:text-gray-200">
										Alamat:
									</label>
									<textarea
										name="address"
										value={orderData.address}
										onChange={handleInputChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
										rows="3"
										placeholder="Masukkan alamat pengiriman"
									/>
								</div>
							)}

							<div>
								<label className="text-sm font-medium text-gray-700 dark:text-gray-200">
									Metode Pembayaran:
								</label>
								<select
									name="paymentMethod"
									value={orderData.paymentMethod}
									onChange={handleInputChange}
									className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
								>
									<option value="cod">COD</option>
									<option value="digital">Digital (Transfer)</option>
								</select>
							</div>

							{orderError && (
								<p className="text-red-600 text-sm">{orderError}</p>
							)}
							{orderSuccess && (
								<p className="text-green-600 text-sm">
									Pesanan berhasil dibuat! Mengarahkan ke daftar pesanan...
								</p>
							)}

							<button
								type="submit"
								className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow transition-colors"
							>
								Buat Pesanan
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;