import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const AdminRoute = () => {
  const { isAdmin } = useAuth();

  // if(!isAuthenticated) return <Navigate to='/' />
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
  // return <Outlet />
};
export default AdminRoute;
