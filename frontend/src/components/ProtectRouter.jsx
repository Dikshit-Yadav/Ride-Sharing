import { Navigate } from "react-router-dom";

const ProtectedRouteWrapper = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRouteWrapper;