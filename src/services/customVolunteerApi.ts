const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Custom Volunteer types
export interface CustomVolunteer {
  id: string;
  volunteerId: string;
  profilePhoto?: string;
  fullName: string;
  parentName?: string;
  email: string;
  mobile: string;
  alternateMobile?: string;
  dateOfBirth?: string;
  age?: number;
  gender: string;
  maritalStatus: string;
  nationality: string;
  bloodGroup: string;
  aadhaarNumber?: string;
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    other?: string;
  };
  currentAddress?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  highestQualification?: string;
  fieldOfStudy?: string;
  institutionName?: string;
  yearOfCompletion?: number;
  certifications?: string[];
  skills?: string[];
  role: string;
  createdBy: string;
  createdByRole: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomVolunteerStats {
  total: number;
  byStatus: Record<string, number>;
  byRole: Record<string, number>;
  byCity: Array<{ _id: string; count: number }>;
}

export interface PaginatedCustomVolunteers {
  success?: boolean;
  data: CustomVolunteer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Helper function for fetch requests with auth
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
export const customVolunteerApi = {
  // Create a new custom volunteer
  createVolunteer: async (data: Partial<CustomVolunteer>): Promise<{ success: boolean; data: CustomVolunteer; message: string }> => {
    return fetchApi<{ success: boolean; data: CustomVolunteer; message: string }>('/api/custom-volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all custom volunteers with pagination and filtering
  getVolunteers: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedCustomVolunteers> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return fetchApi<PaginatedCustomVolunteers>(`/api/custom-volunteers${query ? `?${query}` : ''}`);
  },

  // Get single volunteer by ID
  getVolunteer: async (id: string): Promise<{ success: boolean; data: CustomVolunteer }> => {
    return fetchApi<{ success: boolean; data: CustomVolunteer }>(`/api/custom-volunteers/${id}`);
  },

  // Update volunteer
  updateVolunteer: async (id: string, data: Partial<CustomVolunteer>): Promise<{ success: boolean; data: CustomVolunteer; message: string }> => {
    return fetchApi<{ success: boolean; data: CustomVolunteer; message: string }>(`/api/custom-volunteers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete volunteer
  deleteVolunteer: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/api/custom-volunteers/${id}`, {
      method: 'DELETE',
    });
  },

  // Get volunteer statistics
  getStats: async (): Promise<{ success: boolean; data: CustomVolunteerStats }> => {
    return fetchApi<{ success: boolean; data: CustomVolunteerStats }>('/api/custom-volunteers/stats');
  },
};

export default customVolunteerApi;
