const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Community Member types
export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  mobile: string;
  education: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityStats {
  total: number;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
    archived: number;
  };
  byEducation: Record<string, number>;
}

export interface PaginatedCommunityMembers {
  data: CommunityMember[];
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
export const communityApi = {
  // Create a new community member (public endpoint for form submission)
  createMember: async (data: {
    name: string;
    email: string;
    mobile: string;
    education: string;
  }): Promise<{ success: boolean; data: CommunityMember }> => {
    return fetchApi<{ success: boolean; data: CommunityMember }>('/api/community', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all community members with pagination and filtering
  getMembers: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedCommunityMembers> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return fetchApi<PaginatedCommunityMembers>(`/api/community${query ? `?${query}` : ''}`);
  },

  // Get single community member by ID
  getMember: async (id: string): Promise<{ success: boolean; data: CommunityMember }> => {
    return fetchApi<{ success: boolean; data: CommunityMember }>(`/api/community/${id}`);
  },

  // Update community member (status and notes)
  updateMember: async (id: string, data: { status: string; notes?: string }): Promise<{ success: boolean; data: CommunityMember }> => {
    return fetchApi<{ success: boolean; data: CommunityMember }>(`/api/community/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete community member
  deleteMember: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/api/community/${id}`, {
      method: 'DELETE',
    });
  },

  // Get community member statistics
  getStats: async (): Promise<{ success: boolean; data: CommunityStats }> => {
    return fetchApi<{ success: boolean; data: CommunityStats }>('/api/community/stats');
  },
};

export default communityApi;
