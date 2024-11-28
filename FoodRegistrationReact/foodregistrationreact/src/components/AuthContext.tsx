import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken');
    console.log("Stored Token:", storedToken); // Debug log to check stored token
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (token: string) => {
    console.log("Setting Token:", token); // Debug log when setting token
    setToken(token);
    sessionStorage.setItem('authToken', token);
  };

  const logout = () => {
    console.log("Removing Token"); // Debug log when removing token
    setToken(null);
    sessionStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};