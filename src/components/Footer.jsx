import React from "react";
import logo from "../assets/logo_tp.png";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#F5F5DC', minHeight: '120px' }} className="w-full py-12 flex items-center">
      <div className="container mx-auto flex items-center justify-between w-full">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-24 w-auto mr-8" />
          <div>
            <span className="text-2xl font-bold" style={{ color: '#14532d' }}>
              &copy; {new Date().getFullYear()} Pasarku. All rights reserved.
            </span>
            <div className="mt-4 flex flex-col space-y-2 text-lg" style={{ color: '#14532d' }}>
              <div className="flex items-center">
                {/* Telepon SVG Baru */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="#14532d">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 16.92v3a2 2 0 01-2.18 2A19.72 19.72 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.36 6.36l1.27-1.27a2 2 0 012.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0122 16.92z" />
                </svg>
                <span>0812-3456-7890</span>
              </div>
              <div className="flex items-center">
                {/* Email SVG Baru */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="#14532d">
                  <rect width="20" height="16" x="2" y="4" rx="2" ry="2" stroke="#14532d" strokeWidth="2" fill="none" />
                  <polyline points="22,6 12,13 2,6" stroke="#14532d" strokeWidth="2" fill="none" />
                </svg>
                <span>info@pasarku.com</span>
              </div>
              <div className="flex items-center">
                {/* Lokasi SVG Baru */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="#14532d">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-6-5.686-6-10A6 6 0 0112 5a6 6 0 016 6c0 4.314-6 10-6 10z" />
                  <circle cx="12" cy="11" r="2.5" stroke="#14532d" strokeWidth="2" fill="none" />
                </svg>
                <span>Jl. Pasar Baru No. 123, Jakarta</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start text-left max-w-xs" style={{ color: '#14532d' }}>
          <span className="text-xl font-semibold mb-2">Tentang Pasarku</span>
          <p className="text-base mb-4">Pasarku adalah platform belanja online yang menyediakan produk segar dan kebutuhan harian langsung dari pasar tradisional ke rumah Anda.</p>
          <div className="flex space-x-4 mt-2">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#14532d"/>
                <path d="M15.5 8.5h-2V7.5c0-.414.336-.75.75-.75h1.25V5h-2c-1.104 0-2 .896-2 2v1.5H8.5V11h2v5h2.5v-5h1.5l.5-2.5z" fill="#fff"/>
              </svg>
            </a>
            {/* Twitter */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#14532d"/>
                <path d="M18.23 8.13c-.39.17-.8.28-1.23.33.44-.26.78-.67.94-1.16-.41.24-.87.42-1.36.52a2.13 2.13 0 00-3.63 1.94c-1.77-.09-3.34-.94-4.39-2.23-.19.33-.3.71-.3 1.12 0 .77.39 1.45.99 1.85-.36-.01-.7-.11-.99-.27v.03c0 1.08.77 1.98 1.8 2.19-.19.05-.39.08-.6.08-.14 0-.28-.01-.41-.04.28.87 1.09 1.5 2.05 1.52A4.29 4.29 0 017 16.29c-.29 0-.57-.02-.85-.07A6.06 6.06 0 0012 18c3.63 0 5.62-3.01 5.62-5.62 0-.09 0-.18-.01-.27.39-.28.73-.63 1-1.03z" fill="#fff"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#14532d"/>
                <rect x="7" y="7" width="10" height="10" rx="3" fill="#fff"/>
                <circle cx="12" cy="12" r="3" fill="#14532d"/>
                <circle cx="16" cy="8" r="1" fill="#14532d"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
