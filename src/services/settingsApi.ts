const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Settings types
export interface Setting {
  id: string;
  key: string;
  value: unknown;
  category: 'general' | 'notifications' | 'security' | 'appearance' | 'integrations' | 'backup';
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsStats {
  total: number;
  byCategory: { _id: string; count: number }[];
  activeNotifications: number;
  activeIntegrations: number;
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

// Settings API functions
export const settingsApi = {
  // Get all settings with optional category filter
  getSettings: async (category?: string): Promise<{ success: boolean; data: Setting[] }> => {
    const query = category ? `?category=${category}` : '';
    return fetchApi<{ success: boolean; data: Setting[] }>(`/api/settings${query}`);
  },

  // Get single setting by key
  getSetting: async (key: string): Promise<{ success: boolean; data: Setting }> => {
    return fetchApi<{ success: boolean; data: Setting }>(`/api/settings/${key}`);
  },

  // Update a single setting
  updateSetting: async (key: string, data: {
    value: unknown;
    category?: string;
    description?: string;
    type?: string;
  }): Promise<{ success: boolean; data: Setting }> => {
    return fetchApi<{ success: boolean; data: Setting }>(`/api/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Update multiple settings at once
  updateSettings: async (settings: {
    key: string;
    value: unknown;
    category?: string;
    description?: string;
    type?: string;
  }[]): Promise<{ success: boolean; data: Setting[]; message: string }> => {
    return fetchApi<{ success: boolean; data: Setting[]; message: string }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  },

  // Seed default settings
  seedSettings: async (): Promise<{ success: boolean; data: Setting[]; message: string }> => {
    return fetchApi<{ success: boolean; data: Setting[]; message: string }>('/api/settings/seed', {
      method: 'POST',
    });
  },

  // Get settings statistics
  getStats: async (): Promise<{ success: boolean; data: SettingsStats }> => {
    return fetchApi<{ success: boolean; data: SettingsStats }>('/api/settings/stats');
  },
};

export default settingsApi;
