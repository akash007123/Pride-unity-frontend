const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Event types
export interface EventSchedule {
  time: string;
  event: string;
}

export interface EventOrganizer {
  name: string;
  email?: string;
  phone?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  location: string;
  isOnline: boolean;
  meetingLink?: string;
  organizer: EventOrganizer;
  price: number;
  isFree: boolean;
  currency: string;
  maxAttendees: number | null;
  currentAttendees: number;
  tags: string[];
  featured: boolean;
  image?: string;
  schedule: EventSchedule[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  registrationOpen: boolean;
  spotsLeft: number | null;
  isSoldOut: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  event: string | Event;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  accessibilityNeeds?: string;
  ticketId: string;
  status: 'confirmed' | 'cancelled' | 'waitlisted';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  amount: number;
  notes?: string;
  createdAt: string;
}

export interface EventStats {
  total: number;
  byStatus: {
    draft: number;
    published: number;
    cancelled: number;
    completed: number;
  };
  totalRegistrations: number;
  totalAttendees: number;
}

export interface PaginatedEvents {
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedRegistrations {
  data: EventRegistration[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get auth token
function getAuthToken(): string | null {
  return localStorage.getItem('adminToken');
}

// Helper function for fetch requests
async function fetchApi<T>(
  url: string, 
  options?: RequestInit,
  requireAuth: boolean = false
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Add auth token if required
  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

// Public API functions (no auth required)
export const eventApi = {
  // Get all published events (public)
  getEvents: async (params?: {
    page?: number;
    limit?: number;
    featured?: boolean;
    status?: string;
  }): Promise<PaginatedEvents> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return fetchApi<PaginatedEvents>(`/api/events${query ? `?${query}` : ''}`);
  },

  // Get single event by ID or slug (public)
  getEvent: async (idOrSlug: string): Promise<{ success: boolean; data: Event }> => {
    return fetchApi<{ success: boolean; data: Event }>(`/api/events/${idOrSlug}`);
  },

  // Register for an event (public)
  registerForEvent: async (
    eventId: string, 
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      accessibilityNeeds?: string;
    }
  ): Promise<{ success: boolean; message: string; data: EventRegistration }> => {
    return fetchApi<{ success: boolean; message: string; data: EventRegistration }>(
      `/api/events/${eventId}/register`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Get event statistics (admin)
  getStats: async (): Promise<{ success: boolean; data: EventStats }> => {
    return fetchApi<{ success: boolean; data: EventStats }>(
      '/api/events/stats',
      {},
      true
    );
  },

  // Admin: Get all events (including drafts)
  getAdminEvents: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedEvents> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return fetchApi<PaginatedEvents>(
      `/api/events/admin/all${query ? `?${query}` : ''}`,
      {},
      true
    );
  },

  // Admin: Create new event
  createEvent: async (data: Partial<Event>): Promise<{ success: boolean; data: Event }> => {
    return fetchApi<{ success: boolean; data: Event }>(
      '/api/events',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      true
    );
  },

  // Admin: Update event
  updateEvent: async (
    id: string, 
    data: Partial<Event>
  ): Promise<{ success: boolean; data: Event }> => {
    return fetchApi<{ success: boolean; data: Event }>(
      `/api/events/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      true
    );
  },

  // Admin: Delete event
  deleteEvent: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(
      `/api/events/${id}`,
      {
        method: 'DELETE',
      },
      true
    );
  },

  // Admin: Get event registrations
  getEventRegistrations: async (
    eventId: string, 
    params?: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ): Promise<PaginatedRegistrations> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return fetchApi<PaginatedRegistrations>(
      `/api/events/${eventId}/registrations${query ? `?${query}` : ''}`,
      {},
      true
    );
  },

  // Admin: Get all registrations
  getAllRegistrations: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    eventId?: string;
  }): Promise<PaginatedRegistrations> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.eventId) searchParams.set('eventId', params.eventId);

    const query = searchParams.toString();
    return fetchApi<PaginatedRegistrations>(
      `/api/events/registrations${query ? `?${query}` : ''}`,
      {},
      true
    );
  },

  // Cancel registration
  cancelRegistration: async (
    registrationId: string
  ): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(
      `/api/events/registrations/${registrationId}/cancel`,
      {
        method: 'POST',
      }
    );
  },
};

export default eventApi;
