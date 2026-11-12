import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ViewTab, ToastMessage, BroadcastAlert } from '../types';
import { getDevToolsSettings, saveDevToolsSettings, DevToolsSimulationSettings } from '../services/api';
import { liveopsService } from '../services/liveopsService';

interface LiveOpsContextType {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  devToolsOpen: boolean;
  setDevToolsOpen: (open: boolean) => void;
  devToolsSettings: DevToolsSimulationSettings;
  updateDevToolsSettings: (updates: Partial<DevToolsSimulationSettings>) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;
  activeBroadcasts: BroadcastAlert[];
  refreshBroadcasts: () => Promise<void>;
}

const LiveOpsContext = createContext<LiveOpsContextType | undefined>(undefined);

export const LiveOpsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [devToolsSettings, setSettingsState] = useState<DevToolsSimulationSettings>(getDevToolsSettings);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeBroadcasts, setActiveBroadcasts] = useState<BroadcastAlert[]>([]);

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateDevToolsSettings = (updates: Partial<DevToolsSimulationSettings>) => {
    const updated = { ...devToolsSettings, ...updates };
    setSettingsState(updated);
    saveDevToolsSettings(updated);
  };

  const refreshBroadcasts = async () => {
    try {
      const res = await liveopsService.getBroadcasts();
      if (res.success) {
        setActiveBroadcasts(res.data.filter(b => b.isActive));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshBroadcasts();
    const interval = setInterval(refreshBroadcasts, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LiveOpsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        devToolsOpen,
        setDevToolsOpen,
        devToolsSettings,
        updateDevToolsSettings,
        toasts,
        addToast,
        removeToast,
        activeBroadcasts,
        refreshBroadcasts,
      }}
    >
      {children}
    </LiveOpsContext.Provider>
  );
};

export const useLiveOps = () => {
  const context = useContext(LiveOpsContext);
  if (!context) {
    throw new Error('useLiveOps must be used within a LiveOpsProvider');
  }
  return context;
};
