import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { searchProducts } from "../services/api"; // Adjust path to your API service file

const Products = () => {
	const [products, setProducts] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("termurah");
	const [category, setCategory] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const categories = [
		{ value: "", label: "Semua Kategori" },
		{ value: "buah", label: "Buah" },
		{ value: "sayuran", label: "Sayuran" },
		{ value: "ikan", label: "Ikan" },
	];

	const fetchProducts = async (query = "", sort = "termurah", cat = "") => {
		setLoading(true);
		setError(null);
		try {
			const data = await searchProducts(query, sort);
			let filteredProducts = data.map((item) => ({
				id: item.id,
				name: item.item.name,
				price: item.item.basePrice,
				image: item.merchant.photoUrl || "https://via.placeholder.com/150",
				description: `Dijual oleh ${item.merchant.name} - Kategori: ${item.item.category}`,
				itemCategory: item.item.category,
			}));
			if (cat) {
				filteredProducts = filteredProducts.filter(
					(product) => product.itemCategory.toLowerCase() === cat.toLowerCase()
				);
			}
			setProducts(filteredProducts);
		} catch (err) {
			setError(err.message);
			setProducts([]);
		} finally {
			setLoading(false);
		}
	};

	// Fetch initial products on component mount
	useEffect(() => {
		fetchProducts(searchQuery, sortBy, category);
	}, [sortBy, category]);

	// Handle search input change with debouncing
	const handleSearch = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		const debounce = setTimeout(() => {
			fetchProducts(query, sortBy, category);
		}, 500);
		return () => clearTimeout(debounce);
	};

	// Handle search button click
	const handleSearchClick = () => {
		fetchProducts(searchQuery, sortBy, category);
	};

	// Handle sort change
	const handleSortChange = (e) => {
		const newSort = e.target.value;
		setSortBy(newSort);
	};

	// Handle category change
	const handleCategoryChange = (e) => {
		const newCategory = e.target.value;
		setCategory(newCategory);
	};

	return (
		<div className="p-6 min-h-screen bg-[#F5F5DC]">
			<h2 className="text-3xl font-extrabold text-green-700 mb-8 text-center drop-shadow">
				Katalog Produk
			</h2>

			{/* Search and Filter Section */}
			<section className="py-6 bg-[#F5F5DC]">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
						<div className="relative flex-1 w-full">
							<input
								type="text"
								placeholder="Cari produk..."
								value={searchQuery}
								onChange={handleSearch}
								className="w-full px-6 py-4 rounded-xl border-2 border-[#76AB51] focus:outline-none focus:border-[#1C5532] text-[#1C5532] bg-white"
							/>
							<button
								onClick={handleSearchClick}
								className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1C5532] text-[#F5F5DC] p-3 rounded-lg hover:bg-[#76AB51] transition duration-300"
							>
								<FiSearch className="text-xl" />
							</button>
						</div>
						<select
							value={category}
							onChange={handleCategoryChange}
							className="px-4 py-4 rounded-xl border-2 border-[#76AB51] focus:outline-none focus:border-[#1C5532] text-[#1C5532] bg-white w-full sm:w-48"
						>
							{categories.map((cat) => (
								<option key={cat.value} value={cat.value}>
									{cat.label}
								</option>
							))}
						</select>
						<select
							value={sortBy}
							onChange={handleSortChange}
							className="px-4 py-4 rounded-xl border-2 border-[#76AB51] focus:outline-none focus:border-[#1C5532] text-[#1C5532] bg-white w-full sm:w-48"
						>
							<option value="termurah">Termurah</option>
							<option value="termahal">Termahal</option>
						</select>
					</div>
				</div>
			</section>

			{/* Loading and Error States */}
			{loading && <p className="text-center text-gray-500">Memuat produk...</p>}
			{error && <p className="text-center text-red-500">Error: {error}</p>}
			{!loading && !error && products.length === 0 && (
				<p className="text-center text-gray-500">Tidak ada produk ditemukan</p>
			)}

			{/* Product Grid */}
			{products.length > 0 && (
				<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
					{products.map((product) => (
						<div
							key={product.id}
							className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center"
						>
							<img
								src={product.image || "https://via.placeholder.com/150"}
								alt={product.name}
								className="w-32 h-32 object-cover rounded-lg mb-4 border"
							/>
							<h3 className="text-lg font-bold text-green-800 mb-2 text-center">
								{product.name}
							</h3>
							{product.description && (
								<p className="text-gray-500 text-sm mb-2 text-center line-clamp-2">
									{product.description}
								</p>
							)}
							<p className="text-green-700 font-semibold text-xl mb-4">
								Rp{product.price.toLocaleString("id-ID")}
							</p>
							<button className="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-colors">
								Lihat Detail
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Products;