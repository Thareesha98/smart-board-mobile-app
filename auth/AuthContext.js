import { createContext, useEffect, useState } from "react";
import {
  saveAuth,
  getUser,
  getToken,
  clearAuth
} from "../client/authStorage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved user from storage at app start
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUser();
      if (storedUser) setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (token, refreshToken, userObj) => {
    await saveAuth(token, refreshToken, userObj);
    setUser(userObj);
  };

  const logout = async () => {
    await clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
