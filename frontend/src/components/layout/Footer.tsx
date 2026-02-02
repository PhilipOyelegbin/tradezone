import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#E25822] text-white py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">TradeZone</h3>
          <p>
            Your one-stop shop for electronics, gadgets, and more. Quality
            products delivered fast.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:underline">
                Products
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:underline">
                Account
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:underline">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4">Stay Connected</h3>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded text-gray-900"
            />
            <button className="bg-white text-[#E25822] rounded px-4 py-2 font-semibold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </form>
          <div className="flex space-x-4 mt-4">
            <a href="#">
              <FiFacebook size={24} />
            </a>
            <a href="#">
              <FiTwitter size={24} />
            </a>
            <a href="#">
              <FiInstagram size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm">
        &copy; {new Date().getFullYear()} <b>TradeZone</b>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
