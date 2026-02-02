import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useProductActions, useProductStore } from "../store/product.store";
import { useCartStore } from "../store/cart.store";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const product = useProductStore((state) => state.currentProduct);
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);
  const { getProductById } = useProductActions();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    getProductById(id);
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading product...</p>;

  if (error) return <p className="p-6 text-center">🚨 {error}</p>;

  if (!product) return <p className="p-6 text-center">⚠️ Product not found.</p>;

  return (
    <div className="container mx-auto px-6 py-10">
      {product?.id && (
        <div className="grid md:grid-cols-2 gap-10">
          <img
            src={product?.images[0] || "https://via.placeholder.com/500"}
            alt={product?.name}
            className="rounded-xl shadow"
          />

          <div>
            <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
            <p className="text-gray-500 mb-4">{product?.category.name}</p>

            <div className="flex justify-between items-center">
              <p className="text-xl font-bold text-[#E25822] mb-4">
                ₦{product?.price}
              </p>
              <p>#{product?.quantity}</p>
            </div>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              {product?.description}
            </p>

            <button
              onClick={() => addToCart(product)}
              className="bg-[#E25822] text-white px-8 py-3 rounded-lg hover:bg-[#B84016]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="font-semibold">John D.</p>
            <p className="text-sm text-gray-500">⭐⭐⭐⭐⭐</p>
            <p className="mt-2">Excellent product! Totally worth the price.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="font-semibold">Sarah K.</p>
            <p className="text-sm text-gray-500">⭐⭐⭐⭐</p>
            <p className="mt-2">Very good quality, delivery was fast.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
