import { apiRequest } from './api';
import { LiveOpsMetrics, StorePack, BroadcastAlert, AuditLogEntry, PlayerCard } from '../types';

export const liveopsService = {
  async getMetrics(): Promise<{ success: boolean; data: LiveOpsMetrics }> {
    return apiRequest<{ success: boolean; data: LiveOpsMetrics }>('/liveops/metrics');
  },

  async getBroadcasts(): Promise<{ success: boolean; data: BroadcastAlert[] }> {
    return apiRequest<{ success: boolean; data: BroadcastAlert[] }>('/liveops/broadcasts');
  },

  async createBroadcast(data: { title: string; message: string; type: string; expiresAt?: string }): Promise<{ success: boolean; data: BroadcastAlert }> {
    return apiRequest<{ success: boolean; data: BroadcastAlert }>('/liveops/broadcasts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteBroadcast(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/liveops/broadcasts/${id}`, {
      method: 'DELETE',
    });
  },

  async getPacks(): Promise<{ success: boolean; data: StorePack[] }> {
    return apiRequest<{ success: boolean; data: StorePack[] }>('/liveops/packs');
  },

  async simulatePackPull(packId: string): Promise<{ success: boolean; data: { player: PlayerCard; rarityTier: string; isWalkout: boolean } }> {
    return apiRequest<{ success: boolean; data: { player: PlayerCard; rarityTier: string; isWalkout: boolean } }>('/liveops/packs/simulate-pull', {
      method: 'POST',
      body: JSON.stringify({ packId }),
    });
  },

  async getAuditLogs(): Promise<{ success: boolean; data: AuditLogEntry[] }> {
    return apiRequest<{ success: boolean; data: AuditLogEntry[] }>('/liveops/audit-log');
  },

  async resetData(): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>('/liveops/reset-data', {
      method: 'POST',
    });
  },
};

