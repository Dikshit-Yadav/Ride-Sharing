import { Navigate } from "react-router-dom";
import API from "../services/api";
import { useEffect, useState } from "react";

const ProtectedRouteWrapper = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get("/auth/isme", {
          withCredentials: true,
        });

        const data = res.data;
        if (data.isauthenticate) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading || user === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRouteWrapper;