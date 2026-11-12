import { apiRequest } from './api';
import { LiveEvent, EventFilterState } from '../types';

export const eventService = {
  async getEvents(filters?: Partial<EventFilterState>): Promise<{ success: boolean; count: number; data: LiveEvent[] }> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters?.type && filters.type !== 'ALL') params.append('type', filters.type);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<{ success: boolean; count: number; data: LiveEvent[] }>(`/events${query}`);
  },

  async getEventById(id: string): Promise<{ success: boolean; data: LiveEvent }> {
    return apiRequest<{ success: boolean; data: LiveEvent }>(`/events/${id}`);
  },

  async createEvent(eventData: Partial<LiveEvent>): Promise<{ success: boolean; data: LiveEvent }> {
    return apiRequest<{ success: boolean; data: LiveEvent }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(id: string, updates: Partial<LiveEvent>): Promise<{ success: boolean; data: LiveEvent }> {
    return apiRequest<{ success: boolean; data: LiveEvent }>(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteEvent(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

