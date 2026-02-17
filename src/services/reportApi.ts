const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Report types
export interface Report {
  id: string;
  title: string;
  type: 'activity' | 'user' | 'contact' | 'volunteer' | 'event' | 'financial';
  description: string;
  date: string;
  status: 'ready' | 'processing' | 'scheduled';
  generatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  data: Record<string, unknown>;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportStats {
  total: number;
  ready: number;
  processing: number;
  scheduled: number;
  thisMonth: number;
}

export interface PaginatedReports {
  success?: boolean;
  data: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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

// Report API functions
export const reportApi = {
  // Get all reports with pagination and filtering
  getReports: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }): Promise<PaginatedReports> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.type) searchParams.set('type', params.type);
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return fetchApi<PaginatedReports>(`/api/reports${query ? `?${query}` : ''}`);
  },

  // Get single report by ID
  getReport: async (id: string): Promise<{ success: boolean; data: Report }> => {
    return fetchApi<{ success: boolean; data: Report }>(`/api/reports/${id}`);
  },

  // Generate a new report
  generateReport: async (data: {
    type: string;
    title?: string;
    description?: string;
  }): Promise<{ success: boolean; data: Report }> => {
    return fetchApi<{ success: boolean; data: Report }>('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Delete a report
  deleteReport: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/api/reports/${id}`, {
      method: 'DELETE',
    });
  },

  // Get report statistics
  getStats: async (): Promise<{ success: boolean; data: ReportStats }> => {
    return fetchApi<{ success: boolean; data: ReportStats }>('/api/reports/stats');
  },
};

export default reportApi;
