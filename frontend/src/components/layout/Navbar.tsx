import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";
import { FiMenu, FiX, FiShoppingCart, FiUser } from "react-icons/fi";
import { useUserStore } from "../../store/user.store";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCartStore((state) => state);
  const { token } = useUserStore((state) => state);

  return (
    <nav className="bg-[#E25822] text-white shadow-md">
      <div className="container mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          TradeZone
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/products" className="hover:underline">
            Products
          </Link>
          <Link
            to={!token ? "/account" : "/profile"}
            className="relative hover:underline"
          >
            <FiUser size={20} />
          </Link>
          <Link to="/cart" className="relative hover:underline">
            <FiShoppingCart size={20} />
            {items && (
              <span className="absolute -top-2 -right-3 bg-white text-[#E25822] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {items?.length || 0}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#E25822] text-white px-6 py-4 space-y-4">
          <Link
            to="/"
            className="block hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to={!token ? "/account" : "/profile"}
            className="block hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/cart"
            className="block relative hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Cart
            {items && (
              <span className="absolute -top-1 left-10 bg-white text-[#E25822] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {items?.length || 0}
              </span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
