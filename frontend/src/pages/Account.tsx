import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserActions, useUserStore } from "../store/user.store";

const Account: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const { success, token, loading, error } = useUserStore((state) => state);
  const { authUser, addUser, verifyUser } = useUserActions();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      first_name,
      last_name,
      email,
      address,
      phone_number,
      password,
    };
    if (isLogin) {
      authUser(formData);
    } else {
      addUser(formData);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyUser(verificationToken);
    if (success === "User verified successfully") {
      navigate("/account");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/profile");
    }
  }, [token, navigate]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center">🚨 {error}</p>;
  }

  if (success === "User created successfully, verification mail sent") {
    return (
      <div className="container mx-auto px-6 py-16 max-w-xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Verify your email</h1>
          <p>ℹ️ Check your email for the verification token</p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              placeholder="Token"
              required
              value={verificationToken}
              onChange={(e) => setVerificationToken(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-[#E25822] text-white py-3 rounded-lg hover:bg-[#B84016]"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-semibold ${
              isLogin
                ? "border-b-2 border-[#E25822] text-[#E25822]"
                : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold ${
              !isLogin
                ? "border-b-2 border-[#E25822] text-[#E25822]"
                : "text-gray-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="First Name"
                required
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-[#E25822] text-white py-3 rounded-lg hover:bg-[#B84016]"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-[#E25822] font-semibold"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Account;
