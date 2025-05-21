
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean; // Added isLoading to the type
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a mock admin password. In a real app, NEVER do this.
const MOCK_ADMIN_PASSWORD = process.env.ADMINPASSWORD || "admin@khizershaikh"; 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // This state tracks initial auth load

  useEffect(() => {
    // Check localStorage for persisted login state
    try {
      const storedAuthState = localStorage.getItem('isAdminLoggedIn');
      if (storedAuthState === 'true') {
        setIsLoggedIn(true);
      }
    } catch (e) {
      // localStorage might not be available (e.g. SSR or private browsing)
      console.warn("Could not access localStorage for auth state.");
    }
    setIsLoading(false); // Auth state has been checked (or attempted)
  }, []);

  const login = async (password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    if (password === MOCK_ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      try {
        localStorage.setItem('isAdminLoggedIn', 'true');
      } catch (e) {
        console.warn("Could not persist auth state to localStorage.");
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('isAdminLoggedIn');
    } catch (e) {
       console.warn("Could not remove auth state from localStorage.");
    }
  };

  // The AdminLayout or other children will handle displaying a loading state
  // based on the `isLoading` value from the context.
  // AuthProvider itself should always render the Provider and its children
  // to ensure server and client initial renders match.

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
