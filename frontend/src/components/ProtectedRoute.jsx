import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading, loadUser } = useAuth();

  useEffect(() => {
    if (!user) loadUser();
  }, [user]);

  if (loading) return null; // o un spinner

  if (!user) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
