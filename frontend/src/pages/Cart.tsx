import { Link, useNavigate } from "react-router-dom";
import { useCartActions, useCartStore } from "../store/cart.store";
import { useEffect, useState } from "react";
import { useOrderActions } from "../store/order.store";
import toast from "react-hot-toast";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error } = useCartStore((state) => state);
  const { getCarts, removeFromCart, updateCart } = useCartActions();
  const { createOrder } = useOrderActions();
  const [shippingAddress, setShippingAddress] = useState("");

  const handleCartRemoval = async (id: string) => {
    const result = await removeFromCart(id);
    await getCarts();

    if (result?.error) {
      toast.error(`Error: ${result.error}`);
      return;
    }
    toast.success(result?.message || "Item removed from cart");
  };

  const handleIncrease = async (id: string, currentQty: number) => {
    await updateCart(id, { quantity: currentQty + 1 });
    await getCarts();
  };

  const handleDecrease = async (id: string, currentQty: number) => {
    if (currentQty <= 1) return;

    await updateCart(id, { quantity: currentQty - 1 });
    await getCarts();
  };

  const handleOrder = async () => {
    if (!shippingAddress) {
      toast.error("Please enter a shipping address.");
      return;
    }
    try {
      const orderData = {
        carts: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        shipping_address: shippingAddress,
      };
      const result = await createOrder(orderData);
      if (result.error) {
        toast.error(`Error: ${result?.error}`);
        return;
      }
      toast.success(result?.message);
      await getCarts();
      setShippingAddress("");
      navigate(`/checkout/${result.data.id}`);
    } catch (err) {
      toast.error(err || "Failed to create order.");
    }
  };

  useEffect(() => {
    getCarts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <p>🚨 {error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/products" className="text-[#E25822] font-semibold">
          Browse products
        </Link>
      </div>
    );
  }

  const cartItems = Array.isArray(items) ? items : [];
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {cartItems?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            {/* Product Info */}
            <div>
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-gray-500">₦{item.product.price}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDecrease(item.id, item.quantity)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                −
              </button>

              <span className="font-semibold">{item.quantity}</span>

              <button
                onClick={() => handleIncrease(item.id, item.quantity)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => handleCartRemoval(item.id)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        <input
          type="text"
          name="shipping_address"
          className="w-full md:w-1/2"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your shipping address"
          required
        />
      </div>

      {/* Total & Checkout */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xl font-bold">Total: ₦{total}</span>

        <button
          onClick={handleOrder}
          className="bg-[#E25822] text-white px-6 py-3 rounded-lg hover:bg-[#B84016]"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
