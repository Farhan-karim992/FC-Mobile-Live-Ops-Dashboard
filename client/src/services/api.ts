import {
  FALLBACK_EVENTS,
  FALLBACK_PLAYERS,
  FALLBACK_PACKS,
  FALLBACK_BROADCASTS,
  FALLBACK_AUDIT_LOGS,
  FALLBACK_METRICS,
} from '../data/mockClientData';
import { LiveEvent, PlayerCard, BroadcastAlert } from '../types';

export interface DevToolsSimulationSettings {
  simulatedDelayMs: number;
  simulateError: boolean;
  virtualizationEnabled: boolean;
  deviceViewport: 'native' | 'iphone' | 'pixel' | 'ipad';
}

export const getDevToolsSettings = (): DevToolsSimulationSettings => {
  try {
    const raw = localStorage.getItem('fc_liveops_devtools');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return {
    simulatedDelayMs: 0,
    simulateError: false,
    virtualizationEnabled: true,
    deviceViewport: 'native',
  };
};

export const saveDevToolsSettings = (settings: DevToolsSimulationSettings) => {
  localStorage.setItem('fc_liveops_devtools', JSON.stringify(settings));
  window.dispatchEvent(new Event('devtools_settings_changed'));
};

const BASE_URL = '/api';

// In-memory fallback state for zero-configuration standalone testing
let localEvents: LiveEvent[] = JSON.parse(JSON.stringify(FALLBACK_EVENTS));
let localPlayers: PlayerCard[] = JSON.parse(JSON.stringify(FALLBACK_PLAYERS));
let localBroadcasts: BroadcastAlert[] = JSON.parse(JSON.stringify(FALLBACK_BROADCASTS));

function handleClientFallback(endpoint: string, options: RequestInit = {}): any {
  const method = (options.method || 'GET').toUpperCase();
  const urlObj = new URL(`http://localhost${endpoint}`);
  const pathname = urlObj.pathname.replace('/api', '');

  // 1. Events
  if (pathname === '/events' && method === 'GET') {
    let results = [...localEvents];
    const search = urlObj.searchParams.get('search');
    const status = urlObj.searchParams.get('status');
    const type = urlObj.searchParams.get('type');
    const sort = urlObj.searchParams.get('sort');
    const order = urlObj.searchParams.get('order');

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(e => e.title.toLowerCase().includes(q) || e.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (status && status !== 'ALL') {
      results = results.filter(e => e.status === status);
    }
    if (type && type !== 'ALL') {
      results = results.filter(e => e.type === type);
    }
    if (sort === 'endDate') {
      results.sort((a, b) => order === 'desc'
        ? new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        : new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    }
    return { success: true, count: results.length, data: results };
  }

  if (pathname === '/events' && method === 'POST') {
    const body = JSON.parse(String(options.body || '{}'));
    const newEvt: LiveEvent = {
      ...body,
      id: `evt-${Date.now().toString(36)}`,
      participantCount: 0,
      progressPercentage: 0,
    };
    localEvents.unshift(newEvt);
    return { success: true, data: newEvt };
  }

  if (pathname.startsWith('/events/') && method === 'PATCH') {
    const id = pathname.replace('/events/', '');
    const body = JSON.parse(String(options.body || '{}'));
    const idx = localEvents.findIndex(e => e.id === id);
    if (idx !== -1) {
      localEvents[idx] = { ...localEvents[idx], ...body };
      return { success: true, data: localEvents[idx] };
    }
  }

  if (pathname.startsWith('/events/') && method === 'DELETE') {
    const id = pathname.replace('/events/', '');
    localEvents = localEvents.filter(e => e.id !== id);
    return { success: true, message: `Event ${id} removed` };
  }

  // 2. Players
  if (pathname === '/players' && method === 'GET') {
    let results = [...localPlayers];
    const search = urlObj.searchParams.get('search');
    const position = urlObj.searchParams.get('position');
    const cardType = urlObj.searchParams.get('cardType');
    const minOvr = urlObj.searchParams.get('minOvr');
    const sort = urlObj.searchParams.get('sort');
    const order = urlObj.searchParams.get('order');

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(q) || p.club.toLowerCase().includes(q));
    }
    if (position && position !== 'ALL') {
      results = results.filter(p => p.position === position);
    }
    if (cardType && cardType !== 'ALL') {
      results = results.filter(p => p.cardType === cardType);
    }
    if (minOvr) {
      results = results.filter(p => p.ovr >= parseInt(minOvr, 10));
    }
    if (sort === 'ovr') {
      results.sort((a, b) => order === 'asc' ? a.ovr - b.ovr : b.ovr - a.ovr);
    }
    if (sort === 'marketPrice') {
      results.sort((a, b) => order === 'asc' ? a.marketPrice - b.marketPrice : b.marketPrice - a.marketPrice);
    }
    return { success: true, count: results.length, data: results };
  }

  if (pathname.includes('/boost') && method === 'PATCH') {
    const id = pathname.split('/')[2];
    const player = localPlayers.find(p => p.id === id);
    if (player) {
      player.isLiveBoostActive = !player.isLiveBoostActive;
      player.boostAmount = player.isLiveBoostActive ? 2 : 0;
      player.ovr = player.baseOvr + player.boostAmount;
      return {
        success: true,
        data: player,
        message: `${player.knownAs} form boost ${player.isLiveBoostActive ? 'activated (+2 OVR)' : 'deactivated'}`,
      };
    }
  }

  // 3. LiveOps (Metrics, Broadcasts, Packs, Logs)
  if (pathname === '/liveops/metrics') {
    return { success: true, data: FALLBACK_METRICS };
  }
  if (pathname === '/liveops/broadcasts' && method === 'GET') {
    return { success: true, data: localBroadcasts };
  }
  if (pathname === '/liveops/broadcasts' && method === 'POST') {
    const body = JSON.parse(String(options.body || '{}'));
    const newBc: BroadcastAlert = {
      ...body,
      id: `bc-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      isActive: true,
      targetClientVersion: 'All',
    };
    localBroadcasts.unshift(newBc);
    return { success: true, data: newBc };
  }
  if (pathname.startsWith('/liveops/broadcasts/') && method === 'DELETE') {
    const id = pathname.replace('/liveops/broadcasts/', '');
    localBroadcasts = localBroadcasts.filter(b => b.id !== id);
    return { success: true, message: `Broadcast ${id} removed` };
  }
  if (pathname === '/liveops/packs') {
    return { success: true, data: FALLBACK_PACKS };
  }
  if (pathname === '/liveops/packs/simulate-pull') {
    const candidate = localPlayers[Math.floor(Math.random() * localPlayers.length)];
    return {
      success: true,
      data: {
        player: candidate,
        rarityTier: `${candidate.ovr}+ OVR Special Pull`,
        isWalkout: candidate.ovr >= 95,
      },
    };
  }
  if (pathname === '/liveops/audit-log') {
    return { success: true, data: FALLBACK_AUDIT_LOGS };
  }
  if (pathname === '/liveops/reset-data') {
    localEvents = JSON.parse(JSON.stringify(FALLBACK_EVENTS));
    localPlayers = JSON.parse(JSON.stringify(FALLBACK_PLAYERS));
    localBroadcasts = JSON.parse(JSON.stringify(FALLBACK_BROADCASTS));
    return { success: true, message: 'All live-ops tables reset to factory defaults.' };
  }

  return { success: true, data: [] };
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const settings = getDevToolsSettings();
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');

  if (settings.simulatedDelayMs > 0) {
    headers.set('x-simulate-delay', settings.simulatedDelayMs.toString());
  }
  if (settings.simulateError) {
    headers.set('x-simulate-error', 'true');
  }

  // Artificial client-side delay for DevTools testing
  if (settings.simulatedDelayMs > 0) {
    await new Promise(r => setTimeout(r, settings.simulatedDelayMs));
  }

  // Error simulation check
  if (settings.simulateError) {
    const errorMsg = 'Simulated 500 Error (Triggered via DevTools Network Simulator)';
    window.dispatchEvent(
      new CustomEvent('api_request_logged', {
        detail: {
          url: `${BASE_URL}${endpoint}`,
          method: options.method || 'GET',
          status: 500,
          duration: settings.simulatedDelayMs,
          timestamp: new Date().toLocaleTimeString(),
        },
      })
    );
    throw new Error(errorMsg);
  }

  const startTime = performance.now();

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const duration = Math.round(performance.now() - startTime);

    window.dispatchEvent(
      new CustomEvent('api_request_logged', {
        detail: {
          url: `${BASE_URL}${endpoint}`,
          method: options.method || 'GET',
          status: response.status,
          duration,
          timestamp: new Date().toLocaleTimeString(),
        },
      })
    );

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.error) errorMessage = errorJson.error;
      } catch {
        // ignore
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (netErr: any) {
    // If backend is unreachable or local offline mode
    const duration = Math.round(performance.now() - startTime);
    const fallbackData = handleClientFallback(endpoint, options);

    window.dispatchEvent(
      new CustomEvent('api_request_logged', {
        detail: {
          url: `${BASE_URL}${endpoint} (Offline Fallback)`,
          method: options.method || 'GET',
          status: 200,
          duration,
          timestamp: new Date().toLocaleTimeString(),
        },
      })
    );

    return fallbackData as T;
  }
}
