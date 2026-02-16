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
  role: 'Admin' | 'Sub Admin' | 'Volunteer' | 'Member';
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
  role?: 'Admin' | 'Sub Admin' | 'Volunteer' | 'Member';
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

  // Get all admins
  getAllAdmins: async (): Promise<{ success: boolean; data: { admins: Admin[] } }> => {
    return fetchApi('/api/auth/admins');
  },

  // Get admin by ID
  getAdminById: async (id: string): Promise<{ success: boolean; data: { admin: Admin } }> => {
    return fetchApi(`/api/auth/admins/${id}`);
  },

  // Update admin (supports file upload for profile pic)
  updateAdmin: async (id: string, data: { name?: string; mobile?: string; role?: string; isActive?: boolean; newPassword?: string }, profilePicFile?: File): Promise<{ success: boolean; message: string; data: { admin: Admin } }> => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.mobile) formData.append('mobile', data.mobile);
    if (data.role) formData.append('role', data.role);
    if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
    if (data.newPassword) formData.append('newPassword', data.newPassword);
    if (profilePicFile) formData.append('profilePic', profilePicFile);

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/api/auth/admins/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  },

  // Toggle admin status
  toggleAdminStatus: async (id: string): Promise<{ success: boolean; message: string; data: { admin: Admin } }> => {
    return fetchApi(`/api/auth/admins/${id}/toggle-status`, {
      method: 'PUT',
    });
  },

  // Delete admin
  deleteAdmin: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchApi(`/api/auth/admins/${id}`, {
      method: 'DELETE',
    });
  },
};

export default authApi;
