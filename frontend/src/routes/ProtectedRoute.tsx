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
    if (admin && tokenData?.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    sessionStorage.setItem("userId", tokenData?.sub || "");
    return children;
  } catch (error) {
    return <Navigate to="/account" replace />;
  }
};

export default ProtectedRoute;
