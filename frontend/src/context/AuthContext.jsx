// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../services/api";

const AuthContext = createContext();


export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (err) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadUser();
  }, []);

  const logout = () => {
    logoutUser(); // solo borra token
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loadUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;