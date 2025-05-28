const Home = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-12 max-w-7xl mx-auto">
      {/* Konten teks */}
      <div className="lg:w-1/2 text-center lg:text-left">
        <h2 className="text-4xl font-bold text-green-700 mb-6">
          Selamat Datang di <span className="text-green-800">Pasarku!</span>
        </h2>
        <p className="text-gray-700 text-lg mb-6">
          Platform belanja buah segar langsung dari petani lokal ke tangan Anda. Dapatkan produk berkualitas dengan harga terbaik.
        </p>
        <a
          href="/products"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Lihat Produk
        </a>
      </div>

      {/* Gambar hero */}
      <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
        <img
          src="/logo.jpeg"
          alt="Ilustrasi buah segar"
          className="rounded-xl shadow-lg w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default Home;
