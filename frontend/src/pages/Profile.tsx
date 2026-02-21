import { useState, useEffect } from "react";
import { useUserActions, useUserStore } from "../store/user.store";
import { FiLogOut, FiTrash, FiUser } from "react-icons/fi";
import { useOrderStore } from "../store/order.store";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

function Profile() {
  const userId = sessionStorage.getItem("userId") || "";
  const { user, loading, error } = useUserStore((state) => state);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone_number: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    new_password: "",
    confirm_password: "",
  });
  const { getUserById, updateUser, logout } = useUserActions();
  const { orders } = useOrderStore((state) => state);
  const { getOrders, deleteOrder } = useOrderStore((state) => state.actions);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatePassword.new_password !== updatePassword.confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await updateUser(userId, { password: updatePassword.new_password });
      toast.success("Password updated successfully!");
      setUpdatePassword({ new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err || "Failed to update password");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(userId, profile);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await deleteOrder(orderId);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(`Deleted order with ID: ${orderId}`);
      await getOrders();
    } catch (err) {
      toast.error(err || "Failed to delete order");
    }
  };

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        address: user.address || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (userId) getUserById(userId);
    getOrders();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 md:px-14 py-16">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-sm text-gray-600">
            Manage your profile, orders, and security settings
          </p>
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 rounded-lg bg-[#E25822] px-4 py-2 text-sm font-medium text-white hover:bg-[#B84016]"
        >
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Contents */}
      <div className="flex flex-col md:flex-row gap-5">
        <section className="rounded-xl bg-white p-6 shadow flex flex-col gap-6 md:flex-row md:w-1/2">
          {loading ? (
            <p>Loading user profile...</p>
          ) : error ? (
            <p>🚨 {error}</p>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <FiUser className="h-20 w-20 rounded-full bg-gray-200 p-4 text-gray-400" />
                <span
                  className={`${user?.is_verified ? "bg-lime-200" : "bg-rose-200"} text-gray-700 px-4 py-2 rounded-2xl inline-block`}
                >
                  {user?.is_verified ? "Verified" : "Unverified"}
                </span>
              </div>

              <form
                onSubmit={handleProfileUpdate}
                className="space-y-4 flex flex-col w-full"
              >
                <input
                  name="first_name"
                  className="border p-2 rounded"
                  type="text"
                  placeholder="First Name"
                  required
                  value={profile.first_name}
                  onChange={handleProfileChange}
                />
                <input
                  name="last_name"
                  className="border p-2 rounded"
                  type="text"
                  placeholder="Last Name"
                  required
                  value={profile.last_name}
                  onChange={handleProfileChange}
                />
                <input
                  name="email"
                  className="border p-2 rounded"
                  type="email"
                  placeholder="Email Address"
                  required
                  value={profile.email}
                  readOnly
                  onChange={handleProfileChange}
                />
                <input
                  name="phone_number"
                  className="border p-2 rounded"
                  type="text"
                  placeholder="Phone Number"
                  required
                  value={profile.phone_number}
                  onChange={handleProfileChange}
                />
                <input
                  name="address"
                  className="border p-2 rounded"
                  type="text"
                  placeholder="Address"
                  required
                  value={profile.address}
                  onChange={handleProfileChange}
                />

                <button
                  type="submit"
                  className="w-full bg-[#E25822] text-white py-3 rounded-lg hover:bg-[#B84016]"
                >
                  Update Profile
                </button>
              </form>
            </>
          )}
        </section>

        <section className="rounded-xl bg-white p-6 shadow md:w-1/2">
          <h3 className="my-4 text-[#E25822] text-2xl">Change your password</h3>
          <form
            className="max-w-md space-y-4 w-full"
            onSubmit={handlePasswordUpdate}
          >
            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={updatePassword.new_password}
                onChange={(e) =>
                  setUpdatePassword((prev) => ({
                    ...prev,
                    new_password: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={updatePassword.confirm_password}
                onChange={(e) =>
                  setUpdatePassword((prev) => ({
                    ...prev,
                    confirm_password: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-[#E25822] px-4 py-2 text-sm font-medium text-white hover:bg-[#B84016]"
            >
              Update Password
            </button>
          </form>
        </section>
      </div>

      <section className="overflow-x-auto text-gray-700 mt-10 rounded-xl bg-white p-6 shadow">
        <h3 className="my-4 text-[#E25822] text-2xl">My Order History</h3>
        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : error ? (
          <p className="text-center">🚨 {error}</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Shipping Address</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length > 0 &&
                orders?.map((order) => (
                  <tr key={order.id} className="border-b last:border-none">
                    <td className="px-4 py-3">
                      <Link to={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td className="px-4 py-3">{order.shipping_address}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-lime-700"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-indigo-700"
                              : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      ₦ {order.payment_info?.amount}
                    </td>
                    <td>
                      <FiTrash
                        className="inline text-2xl ml-4 cursor-pointer text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteOrder(order?.id || "")}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>
      <Toaster />
    </div>
  );
}

export default Profile;
