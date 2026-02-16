import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Admin {
  id: string;
  name: string;
  email: string;
  username: string;
  mobile: string;
  profilePic: string;
  role: 'admin' | 'sub_admin' | 'manager';
  isActive: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credential: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateAdmin: (admin: Admin) => void;
}

interface RegisterData {
  name: string;
  email: string;
  username: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  profilePic?: string;
  role?: 'admin' | 'sub_admin' | 'manager';
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    admin: Admin;
    token: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('adminToken');
      const storedAdmin = localStorage.getItem('adminData');

      if (storedToken && storedAdmin) {
        try {
          setToken(storedToken);
          setAdmin(JSON.parse(storedAdmin));
        } catch (error) {
          console.error('Error parsing stored admin data:', error);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credential: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const { admin: adminData, token: authToken } = data.data!;

      // Store auth data
      localStorage.setItem('adminToken', authToken);
      localStorage.setItem('adminData', JSON.stringify(adminData));

      setToken(authToken);
      setAdmin(adminData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: AuthResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      const { admin: adminData, token: authToken } = result.data!;

      // Store auth data
      localStorage.setItem('adminToken', authToken);
      localStorage.setItem('adminData', JSON.stringify(adminData));

      setToken(authToken);
      setAdmin(adminData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setToken(null);
    setAdmin(null);
  }, []);

  const updateAdmin = useCallback((newAdmin: Admin) => {
    localStorage.setItem('adminData', JSON.stringify(newAdmin));
    setAdmin(newAdmin);
  }, []);

  const value: AuthContextType = {
    admin,
    token,
    isLoading,
    isAuthenticated: !!token && !!admin,
    login,
    register,
    logout,
    updateAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
