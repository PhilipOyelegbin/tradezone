import { Link } from "react-router-dom";
import { useProductActions, useProductStore } from "../store/product.store";
import ProductCard from "../components/product/ProductCard";
import { useEffect } from "react";
import heroimg from "../assets/delivery.jpg";

export default function Home() {
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);
  const { getProducts } = useProductActions();

  useEffect(() => {
    getProducts(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative bg-[#E25822] text-white">
        <div className="container mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to TradeZone
            </h1>
            <p className="mb-6 text-lg md:text-xl">
              Your one-stop shop for electronics, gadgets, and everything in
              between.
            </p>
            <Link
              to="/products"
              className="bg-white text-[#E25822] font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src={heroimg}
              loading="lazy"
              alt="TradeZone Hero"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : error ? (
          <p className="text-center">🚨 {error}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {products &&
              products
                ?.slice(0, 6)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="bg-[#E25822] text-white px-6 py-3 rounded-lg shadow hover:bg-[#B84016] transition"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Why TradeZone Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Shop With TradeZone?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p>
                Get your orders delivered quickly and reliably, right to your
                doorstep.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p>
                We offer competitive pricing on all products without
                compromising quality.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p>
                Our customer service team is always ready to help with your
                orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-16 bg-[#E25822] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6">
            Subscribe to our newsletter for latest products and deals.
          </p>
          <form className="flex flex-col md:flex-row justify-center items-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-lg w-full md:w-1/3 text-gray-900"
            />
            <button
              type="submit"
              className="bg-white text-[#E25822] font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
