import { useEffect, useState } from "react";
import { getProducts } from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Katalog Produk</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-bold text-green-800">{product.name}</h3>
            <p className="text-gray-600">Rp{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;