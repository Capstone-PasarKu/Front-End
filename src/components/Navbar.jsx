import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
	{ to: "/", label: "Home" },
	{ to: "/products", label: "Products" },
	{ to: "/about", label: "About" },
	{ to: "/login", label: "Login" },
	{ to: "/register", label: "Register", special: true },
];

const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

	// Listen to storage event for login/logout from other tabs
	React.useEffect(() => {
		const handler = () => setIsLoggedIn(!!localStorage.getItem("token"));
		window.addEventListener("storage", handler);
		return () => window.removeEventListener("storage", handler);
	}, []);

	const isActive = (path) => location.pathname === path;

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsLoggedIn(false);
		navigate("/login");
	};

	// Filter navLinks: hide login/register if logged in
	const filteredLinks = isLoggedIn
		? navLinks.filter((l) => l.to !== "/login" && l.to !== "/register")
		: navLinks;

	return (
		<nav className="bg-green-700 shadow-lg px-4 py-3 md:py-4 text-white sticky top-0 z-50 transition-all">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/" className="flex items-center space-x-3 group">
					<img
						src="/src/assets/logo.jpeg"
						alt="Logo Pasarku"
						className="w-10 h-10 rounded-full bg-white object-cover border-2 border-green-700 shadow group-hover:scale-105 transition"
					/>
					<span className="text-2xl font-extrabold tracking-tight group-hover:text-green-200 transition">
						Pasarku
					</span>
				</Link>
				{/* Desktop Menu */}
				<div className="hidden md:flex items-center space-x-1">
					{filteredLinks.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className={`px-4 py-2 rounded font-medium transition border
                ${isActive(link.to)
									? "bg-white text-green-700 border-green-700"
									: "bg-green-700 text-white border-green-700 hover:bg-green-800 hover:text-green-100"}
              `}
						>
							{link.label}
						</Link>
					))}
					{isLoggedIn && (
						<>
							<Link
								to="/profile"
								className={`px-4 py-2 rounded font-medium transition border ml-2
                  ${isActive("/profile")
										? "bg-white text-green-700 border-green-700"
										: "bg-green-700 text-white border-green-700 hover:bg-green-800 hover:text-green-100"}
                `}
							>
								Profil
							</Link>
							<button
								onClick={handleLogout}
								className="px-4 py-2 rounded font-medium transition border ml-2 bg-red-600 text-white hover:bg-red-700 border-red-700"
							>
								Logout
							</button>
						</>
					)}
				</div>
				{/* Mobile Hamburger */}
				<button
					className="md:hidden flex items-center px-2 py-1 rounded hover:bg-green-800 transition"
					onClick={() => setMenuOpen((prev) => !prev)}
					aria-label="Toggle menu"
				>
					<svg
						className="w-7 h-7"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
					>
						{menuOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 8h16M4 16h16"
							/>
						)}
					</svg>
				</button>
			</div>
			{/* Mobile Menu */}
			{menuOpen && (
				<div className="md:hidden mt-2 flex flex-col space-y-1 bg-green-700 rounded shadow-lg px-4 py-3 animate-fade-in-down">
					{filteredLinks.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							onClick={() => setMenuOpen(false)}
							className={`w-full text-center px-4 py-2 rounded font-medium transition border
                ${isActive(link.to)
									? "bg-white text-green-700 border-green-700"
									: "bg-green-700 text-white border-green-700 hover:bg-green-800 hover:text-green-100"}
              `}
						>
							{link.label}
						</Link>
					))}
					{isLoggedIn && (
						<>
							<Link
								to="/profile"
								onClick={() => setMenuOpen(false)}
								className={`w-full text-center px-4 py-2 rounded font-medium transition border bg-green-700 text-white border-green-700 hover:bg-green-800 hover:text-green-100`}
							>
								Profil
							</Link>
							<button
								onClick={() => { setMenuOpen(false); handleLogout(); }}
								className="w-full text-center px-4 py-2 rounded font-medium transition border bg-red-600 text-white hover:bg-red-700 border-red-700 mt-1"
							>
								Logout
							</button>
						</>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;