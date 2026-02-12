import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRouteWrapper = ({ children, loading, isLoggedIn, isEmail }) => {
  const token = Cookies.get("token");
  const email = localStorage.getItem("email");


  if (loading) return <div>Loading...</div>; 

  if (isLoggedIn !== undefined) {
    if (!token || !isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
  }

  if (isEmail !== undefined) {
    if (!email) {
      return <Navigate to="/forget" replace />
    }
  }
 


  return children;
};

export default ProtectedRouteWrapper;
