import { Routes, Route } from "react-router-dom";
import Account from "../pages/Account";
import Admin from "../pages/Admin";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/Profile";
import OrderDetails from "../pages/OrderDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/account" element={<Account />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute admin={false}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute admin={false}>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute admin={false}>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout/:id"
        element={
          <ProtectedRoute admin={false}>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute admin>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
