import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const login = () => {
    // Logic to authenticate the user
    setIsUserAuthenticated(true);
  };

  const logout = () => {
    // Logic to log out the user
    setIsUserAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
