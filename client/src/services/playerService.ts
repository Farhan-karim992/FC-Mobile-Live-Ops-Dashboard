import { apiRequest } from './api';
import { PlayerCard, PlayerFilterState } from '../types';

export const playerService = {
  async getPlayers(filters?: Partial<PlayerFilterState>): Promise<{ success: boolean; count: number; data: PlayerCard[] }> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.position && filters.position !== 'ALL') params.append('position', filters.position);
    if (filters?.cardType && filters.cardType !== 'ALL') params.append('cardType', filters.cardType);
    if (filters?.minOvr) params.append('minOvr', filters.minOvr.toString());
    if (filters?.maxOvr) params.append('maxOvr', filters.maxOvr.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<{ success: boolean; count: number; data: PlayerCard[] }>(`/players${query}`);
  },

  async getPlayerById(id: string): Promise<{ success: boolean; data: PlayerCard }> {
    return apiRequest<{ success: boolean; data: PlayerCard }>(`/players/${id}`);
  },

  async togglePlayerBoost(id: string): Promise<{ success: boolean; data: PlayerCard; message: string }> {
    return apiRequest<{ success: boolean; data: PlayerCard; message: string }>(`/players/${id}/boost`, {
      method: 'PATCH',
    });
  },
};
