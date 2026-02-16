const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Contact types
export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  mobile: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactStats {
  total: number;
  byStatus: {
    new: number;
    read: number;
    replied: number;
    archived: number;
  };
}

export interface PaginatedContacts {
  success?: boolean;
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Helper function for fetch requests
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

// API functions
export const contactApi = {
  // Get all contacts with pagination and filtering
  getContacts: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: 'date' | 'name';
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedContacts> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const query = searchParams.toString();
    return fetchApi<PaginatedContacts>(`/api/contacts${query ? `?${query}` : ''}`);
  },

  // Get single contact by ID
  getContact: async (id: string): Promise<{ success: boolean; data: Contact }> => {
    return fetchApi<{ success: boolean; data: Contact }>(`/api/contacts/${id}`);
  },

  // Update contact (status and notes)
  updateContact: async (id: string, data: { status: string; notes?: string }): Promise<{ success: boolean; data: Contact }> => {
    return fetchApi<{ success: boolean; data: Contact }>(`/api/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete contact
  deleteContact: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/api/contacts/${id}`, {
      method: 'DELETE',
    });
  },

  // Get contact statistics
  getStats: async (): Promise<{ success: boolean; data: ContactStats }> => {
    return fetchApi<{ success: boolean; data: ContactStats }>('/api/contacts/stats');
  },
};

export default contactApi;
