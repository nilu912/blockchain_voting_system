import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Ensure you have a custom hook for auth

const PrivateRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (isAuthenticated && !isAdmin) ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
