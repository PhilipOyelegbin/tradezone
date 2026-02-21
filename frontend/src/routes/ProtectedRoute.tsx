import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useUserStore } from "../store/user.store";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: JSX.Element;
  admin?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, admin }) => {
  const { token } = useUserStore();
  if (!token) {
    return <Navigate to="/account" replace />;
  }

  try {
    const tokenData = jwtDecode<{ sub: string; role: string }>(token);
    sessionStorage.setItem("userId", tokenData?.sub || "");

    if (admin && tokenData?.role !== "admin") {
      return <Navigate to="/profile" replace />;
    }

    if (!admin && tokenData?.role === "admin") {
      return <Navigate to="/host" replace />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/account" replace />;
  }
};

export default ProtectedRoute;
