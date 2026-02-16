import { useAuth } from '@/contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Admin types
export interface Admin {
  id: string;
  name: string;
  email: string;
  username: string;
  mobile: string;
  profilePic: string;
  role: 'admin' | 'sub_admin' | 'manager';
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  credential: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  profilePic?: string;
}

export interface UpdateProfileData {
  name?: string;
  mobile?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  profilePic?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Helper function for fetch requests
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

// Auth API functions
export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<{ success: boolean; data: { admin: Admin; token: string } }> => {
    return fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register
  register: async (data: RegisterData): Promise<{ success: boolean; data: { admin: Admin; token: string } }> => {
    return fetchApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get current admin profile
  getProfile: async (): Promise<{ success: boolean; data: { admin: Admin } }> => {
    return fetchApi('/api/auth/profile');
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData): Promise<{ success: boolean; data: { admin: Admin } }> => {
    return fetchApi('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    return fetchApi('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    return fetchApi('/api/auth/logout', {
      method: 'POST',
    });
  },
};

export default authApi;
