import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

const dummyProducts = [
	{
		id: 1,
		name: "Beras Premium",
		price: 65000,
		image:
			"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
		description: "Beras premium kualitas terbaik, pulen dan harum.",
	},
	{
		id: 2,
		name: "Minyak Goreng 2L",
		price: 32000,
		image:
			"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
		description: "Minyak goreng sehat untuk keluarga.",
	},
	{
		id: 3,
		name: "Telur Ayam 1kg",
		price: 27000,
		image:
			"https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
		description: "Telur ayam segar langsung dari peternak.",
	},
	{
		id: 4,
		name: "Gula Pasir 1kg",
		price: 14000,
		image:
			"https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
		description: "Gula pasir murni, manis alami.",
	},
	{
		id: 5,
		name: "Kopi Bubuk 200gr",
		price: 18000,
		image:
			"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
		description: "Kopi bubuk pilihan, aroma khas Nusantara.",
	},
	{
		id: 6,
		name: "Susu UHT 1L",
		price: 17000,
		image:
			"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
		description: "Susu UHT segar dan bergizi.",
	},
];

const Products = () => {
	const [products, setProducts] = useState(dummyProducts);

	return (
		<div className="p-6 min-h-screen bg-[#F5F5DC]">
			<h2 className="text-3xl font-extrabold text-green-700 mb-8 text-center drop-shadow">
				Katalog Produk
			</h2>

			{/* Search Section */}
			<section className="py-6 bg-[#F5F5DC]">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="relative">
							<input
								type="text"
								placeholder="Cari produk..."
								className="w-full px-6 py-4 rounded-xl border-2 border-[#76AB51] focus:outline-none focus:border-[#1C5532] text-[#1C5532] bg-white"
							/>
							<button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1C5532] text-[#F5F5DC] p-3 rounded-lg hover:bg-[#76AB51] transition duration-300">
								<FiSearch className="text-xl" />
							</button>
						</div>
					</div>
				</div>
			</section>

			<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
				{products.map((product) => (
					<div
						key={product.id}
						className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center"
					>
						{/* Gambar produk, fallback jika tidak ada */}
						<img
							src={product.image || "https://via.placeholder.com/150"}
							alt={product.name}
							className="w-32 h-32 object-cover rounded-lg mb-4 border"
						/>
						<h3 className="text-lg font-bold text-green-800 mb-2 text-center">
							{product.name}
						</h3>
						{/* Deskripsi singkat jika ada */}
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
		</div>
	);
};

export default Products;