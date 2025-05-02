"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoginCredentials, SignupCredentials, AuthResponse, User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (credentials: SignupCredentials) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mock users for demo
  const mockUsers = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@clientcomet.com",
      password: "admin123",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("auth_token");
    if (token) {
      // For demo, we're using a simple user lookup
      // In a real app, you would validate the token on the server
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user (mock implementation)
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (user && user.password === credentials.password) {
        // Create a user object without the password
        const { password, ...userWithoutPassword } = user;
        
        // Set user in state and localStorage
        setUser(userWithoutPassword);
        localStorage.setItem("auth_token", "demo_token");
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        
        return {
          success: true,
          message: "Login successful",
          token: "demo_token",
          user: userWithoutPassword,
        };
      } else {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "An error occurred during login",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === credentials.email);
      
      if (existingUser) {
        return {
          success: false,
          message: "Email already in use",
        };
      }
      
      // In a real app, you would create the user in the database
      // For demo, we're just returning success
      return {
        success: true,
        message: "Account created successfully. Please login.",
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred during signup",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  const contextValue = { user, isLoading, login, signup, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}