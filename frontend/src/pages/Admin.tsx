import { useEffect, useState } from "react";
import {
  FiMenu,
  FiX,
  FiPackage,
  FiUser,
  FiTrash,
  FiDollarSign,
  FiLogOut,
} from "react-icons/fi";
import { useProductActions, useProductStore } from "../store/product.store";
import { Link } from "react-router-dom";
import { useUserActions, useUserStore } from "../store/user.store";
import { usePaymentActions, usePaymentStore } from "../store/payment.store";

type Tab = "products" | "payments" | "users";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useUserActions();

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "products", label: "Products", icon: FiPackage },
    { id: "payments", label: "Payments", icon: FiDollarSign },
    { id: "users", label: "Users", icon: FiUser },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductManager />;
      case "payments":
        return <PaymentManager />;
      case "users":
        return <UserManager />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center">
        <h2 className="text-[#E25822] font-bold text-xl">Admin</h2>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600"
        >
          {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
        ${isMenuOpen ? "block" : "hidden"} 
        md:block w-full md:w-64 bg-white shadow-lg z-10
      `}
      >
        <div className="p-6 border-b hidden md:block">
          <h2 className="text-2xl font-black text-[#E25822]">ADMIN</h2>
        </div>

        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#E25822] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#E25822]"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-gray-600 hover:bg-gray-100 hover:text-[#E25822]"
          >
            <FiLogOut />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
            Manage <span className="text-[#E25822]">{activeTab}</span>
          </h1>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const ProductManager = () => {
  const { products, loading, error } = useProductStore();
  const { getProducts } = useProductActions();

  const handleDeleteProduct = (productId: string) => {
    console.log("Delete product with ID:", productId);
  };

  useEffect(() => {
    getProducts(1);
  }, [getProducts]);

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700">
          Inventory Overview
        </h3>
        <button className="w-full sm:w-auto bg-[#E25822] hover:bg-[#B84016] text-white px-6 py-2 rounded-full font-bold transition-colors">
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto text-gray-700 rounded-xl bg-white shadow">
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : error ? (
          <p className="text-center">🚨 {error}</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium">Product ID</th>
                <th className="px-4 py-3 font-medium">Product Name</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {products?.length > 0 &&
                products?.map((product) => (
                  <tr key={product.id} className="border-b last:border-none">
                    <td className="px-4 py-3">
                      <Link to={`/products/${product.id}`}>{product.id}</Link>
                    </td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.quantity}</td>
                    <td className="px-4 py-3 font-bold">₦ {product.price}</td>
                    <td>
                      <FiTrash
                        className="inline text-2xl ml-4 cursor-pointer text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteProduct(product?.id || "")}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

const PaymentManager = () => {
  const { payments, loading, error } = usePaymentStore();
  const { getPayments } = usePaymentActions();

  const handleDeleteOrder = (paymentId: string) => {
    console.log("Delete order with ID:", paymentId);
  };

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  return (
    <section>
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Recent Payment
      </h3>
      <div className="overflow-x-auto text-gray-700 rounded-xl bg-white shadow">
        {loading ? (
          <p className="text-center">Loading payments...</p>
        ) : error ? (
          <p className="text-center">🚨 {error}</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium">Payment ID</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments?.length > 0 &&
                payments?.map((payment) => (
                  <tr key={payment?.id} className="border-b last:border-none">
                    <td className="px-4 py-3">
                      <Link to={`/payments/${payment?.id}`}>{payment?.id}</Link>
                    </td>
                    <td className="px-4 py-3">{payment?.method}</td>
                    <td className="px-4 py-3 font-bold">₦ {payment?.amount}</td>
                    <td className="px-4 py-3">
                      <span className="text-orange-400">{payment?.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(payment?.create_at || "").toLocaleDateString()}
                    </td>
                    <td>
                      <FiTrash
                        className="inline text-2xl ml-4 cursor-pointer text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteOrder(payment?.id || "")}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

const UserManager = () => {
  const { users, loading, error } = useUserStore();
  const { getUsers } = useUserActions();
  const handleDeleteUser = (userId: string) => {
    console.log("Delete user with ID:", userId);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <section>
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Customer Base
      </h3>
      <div className="overflow-x-auto text-gray-700 rounded-xl bg-white shadow">
        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : error ? (
          <p className="text-center">🚨 {error}</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone Number</th>
                <th className="px-4 py-3 font-medium">Verified</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.length > 0 &&
                users
                  ?.filter((u) => !u.is_admin)
                  .map((user) => (
                    <tr key={user.id} className="border-b last:border-none">
                      <td className="px-4 py-3">
                        <Link to={`/products/${user.id}`}>
                          {user.first_name} {user.last_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-bold">{user.email}</td>
                      <td className="px-4 py-3">{user.phone_number}</td>
                      <td className="px-4 py-3">
                        {user.is_verified ? (
                          <span className="text-green-600">Verified</span>
                        ) : (
                          <span className="text-red-600">Not Verified</span>
                        )}
                      </td>
                      <td>
                        <FiTrash
                          className="inline text-2xl ml-4 cursor-pointer text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteUser(user?.id || "")}
                        />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};
