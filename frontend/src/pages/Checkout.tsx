import { useParams } from "react-router-dom";
import { useOrderActions, useOrderStore } from "../store/order.store";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/product.store";
import toast, { Toaster } from "react-hot-toast";
import { usePaymentActions } from "../store/payment.store";

const Checkout: React.FC = () => {
  const { id } = useParams();
  const [paymentData, setPaymentData] = useState({
    method: "card",
    order_id: "",
  });
  const { currentOrder, loading, error } = useOrderStore((state) => state);
  const { products } = useProductStore((state) => state);
  const { getOrdersById } = useOrderActions();
  const { initiatePayment } = usePaymentActions();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await initiatePayment(paymentData);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(response.message);
      window.location.href = response.data.authorization_url || "/";
    } catch (err) {
      toast.error(err || "Payment failed");
    }
  };

  useEffect(() => {
    getOrdersById(id || "");
    setPaymentData((prev) => ({
      ...prev,
      order_id: currentOrder?.id || "",
    }));
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading order...</p>;

  if (error) return <p className="p-6 text-center">🚨 {error}</p>;

  if (!currentOrder)
    return <p className="p-6 text-center">⚠️ Order not found.</p>;

  return (
    <section className="container mx-auto px-6 py-10 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div
        key={currentOrder?.id}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4"
      >
        <p>
          <strong>Full name:</strong> {currentOrder?.user.first_name}{" "}
          {currentOrder?.user.last_name}
        </p>
        <p>
          <strong>Email:</strong> {currentOrder?.user.email}
        </p>
        <p>
          <strong>Phone number:</strong> {currentOrder?.user.phone_number}
        </p>

        {currentOrder?.carts.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-200 py-4 last:border-none"
          >
            <p className="font-semibold">
              Product Name:{" "}
              {products.find((p) => p.id === item.product_id)?.name ||
                "Unknown Product"}{" "}
              | Quantity: {item.quantity}
            </p>
          </div>
        ))}

        <p className="my-4">
          <span className="font-semibold">Shipping Address:</span>{" "}
          {currentOrder?.shipping_address}
        </p>

        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-[#E25822]">
            ₦{currentOrder?.payment_info?.amount}
          </p>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              currentOrder?.status === "Delivered"
                ? "bg-green-100 text-lime-700"
                : currentOrder?.status === "Shipped"
                  ? "bg-blue-100 text-indigo-700"
                  : currentOrder?.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
            }`}
          >
            {currentOrder?.status}
          </span>
        </div>

        <form className="max-w-md space-y-4 w-full" onSubmit={handlePayment}>
          <div>
            <label
              htmlFor="method"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Method
            </label>
            <select
              name="method"
              id="method"
              onChange={(e) =>
                setPaymentData((prev) => ({
                  ...prev,
                  method: e.target.value,
                }))
              }
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="apple_pay">Apple Pay</option>
              <option value="ussd">USSD</option>
              <option value="qr">QR</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="order_id"
              className="block text-sm font-medium text-gray-700"
            >
              Order ID
            </label>
            <input
              type="text"
              id="order_id"
              name="order_id"
              value={paymentData.order_id}
              readOnly
              onChange={(e) =>
                setPaymentData((prev) => ({
                  ...prev,
                  order_id: e.target.value,
                }))
              }
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-[#E25822] px-4 py-2 text-sm font-medium text-white hover:bg-[#B84016]"
          >
            Pay with Paystack
          </button>
        </form>
      </div>
      <Toaster />
    </section>
  );
};

export default Checkout;
