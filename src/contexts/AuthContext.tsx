import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register } from '../services/authService';


export interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const loginHandler = async (email: string, password: string) => {
    const response = await loginService({ email, password });
    setUser(response.data);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(response.data));
  };

  const registerHandler = async (userData: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const response = await register({
      ...userData,
      confirmPassword: userData.password, // or get this from a form field if available
      role: 'user' // or set this dynamically as needed
    });
    setUser(response.data);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(response.data));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('collegeId');
    localStorage.removeItem('collegeName');
    localStorage.removeItem('userHandle');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      login: loginHandler,
      register: registerHandler,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

