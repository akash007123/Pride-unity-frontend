const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Volunteer types
export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  roles: string[];
  skills: string[];
  availability?: string;
  message?: string;
  agreedToContact: boolean;
  status: 'pending' | 'contacted' | 'approved' | 'rejected' | 'archived';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerStats {
  total: number;
  byStatus: {
    pending: number;
    contacted: number;
    approved: number;
    rejected: number;
    archived: number;
  };
  byRoles: Record<string, number>;
  topSkills: Record<string, number>;
}

export interface PaginatedVolunteers {
  success?: boolean;
  data: Volunteer[];
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
export const volunteerApi = {
  // Create a new volunteer (public endpoint for form submission)
  createVolunteer: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    roles: string[];
    skills: string[];
    availability?: string;
    message?: string;
    agreedToContact: boolean;
  }): Promise<{ success: boolean; data: Volunteer }> => {
    return fetchApi<{ success: boolean; data: Volunteer }>('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all volunteers with pagination and filtering
  getVolunteers: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedVolunteers> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return fetchApi<PaginatedVolunteers>(`/api/volunteers${query ? `?${query}` : ''}`);
  },

  // Get single volunteer by ID
  getVolunteer: async (id: string): Promise<{ success: boolean; data: Volunteer }> => {
    return fetchApi<{ success: boolean; data: Volunteer }>(`/api/volunteers/${id}`);
  },

  // Update volunteer (status and notes)
  updateVolunteer: async (id: string, data: { status: string; notes?: string }): Promise<{ success: boolean; data: Volunteer }> => {
    return fetchApi<{ success: boolean; data: Volunteer }>(`/api/volunteers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete volunteer
  deleteVolunteer: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/api/volunteers/${id}`, {
      method: 'DELETE',
    });
  },

  // Get volunteer statistics
  getStats: async (): Promise<{ success: boolean; data: VolunteerStats }> => {
    return fetchApi<{ success: boolean; data: VolunteerStats }>('/api/volunteers/stats');
  },
};

export default volunteerApi;
