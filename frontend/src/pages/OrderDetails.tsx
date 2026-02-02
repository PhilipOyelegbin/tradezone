import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrderActions, useOrderStore } from "../store/order.store";
import { useProductStore } from "../store/product.store";

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const { currentOrder, loading, error } = useOrderStore((state) => state);
  const { products } = useProductStore((state) => state);
  const { getOrdersById } = useOrderActions();

  useEffect(() => {
    getOrdersById(id || "");
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading order...</p>;

  if (error) return <p className="p-6 text-center">🚨 {error}</p>;

  if (!currentOrder)
    return <p className="p-6 text-center">⚠️ Order not found.</p>;

  return (
    <section className="container mx-auto px-6 py-10">
      {currentOrder?.id && (
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {currentOrder?.user.first_name} {currentOrder?.user.last_name}
          </h1>
          <p className="text-gray-500 mb-4">{currentOrder?.user.email}</p>
          <p className="text-gray-500 mb-4">
            {currentOrder?.user.phone_number}
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
                currentOrder.status === "Delivered"
                  ? "bg-green-100 text-lime-700"
                  : currentOrder.status === "Shipped"
                    ? "bg-blue-100 text-indigo-700"
                    : currentOrder.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
              }`}
            >
              {currentOrder.status}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderDetails;
