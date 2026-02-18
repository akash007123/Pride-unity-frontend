const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Newsletter subscriber types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNewsletters {
  success?: boolean;
  data: NewsletterSubscriber[];
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
}

// Helper function for fetch requests
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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
export const newsletterApi = {
  // Get all subscribers with pagination
  getSubscribers: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedNewsletters> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return fetchApi<PaginatedNewsletters>(`/api/newsletter${query ? `?${query}` : ''}`);
  },

  // Delete subscriber
  deleteSubscriber: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/api/newsletter/${id}`, {
      method: 'DELETE',
    });
  },

  // Export subscribers as CSV
  exportSubscribers: async (): Promise<Blob> => {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/newsletter/export`, {
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'An error occurred');
    }

    return response.blob();
  },
};

export default newsletterApi;
