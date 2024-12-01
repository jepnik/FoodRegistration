import React, { createContext, useContext, useState } from 'react';

// Defines shape of the AuthContextType interface
interface AuthContextType {
  token: string | null; // Authentication token for user
  isAuthenticated: boolean; // Checks for authentication
  login: (token: string) => void;
  logout: () => void;
}

// Creates context with an undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));

  // Logs in user, sets and stores token in local storage
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('userToken', newToken);
  };

  // Logs out user and clears token
  const logout = () => {
    setToken(null);
    localStorage.removeItem('userToken');
  };

  // Determine if user is authenticated based on token presence
  const isAuthenticated = !!token;

  // Provides context value to children components
  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
