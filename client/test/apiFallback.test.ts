import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock browser globals for Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (k: string) => store[k] || null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; },
    key: (i: number) => Object.keys(store)[i] || null,
    length: Object.keys(store).length,
  };
}

if (typeof globalThis.window === 'undefined') {
  // @ts-ignore
  globalThis.window = {
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

if (typeof globalThis.CustomEvent === 'undefined') {
  // @ts-ignore
  globalThis.CustomEvent = class CustomEvent {
    type: string;
    detail: any;
    constructor(type: string, params: any = {}) {
      this.type = type;
      this.detail = params.detail;
    }
  };
}

// Import api module after globals are established
import { apiRequest, getDevToolsSettings, saveDevToolsSettings } from '../src/services/api';

describe('Client Resilient API Client & Offline Fallback Router', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('reads and persists DevTools simulation settings to localStorage', () => {
    const defaults = getDevToolsSettings();
    assert.strictEqual(defaults.simulatedDelayMs, 0);
    assert.strictEqual(defaults.simulateError, false);
    assert.strictEqual(defaults.deviceViewport, 'native');

    saveDevToolsSettings({
      simulatedDelayMs: 400,
      simulateError: false,
      virtualizationEnabled: true,
      deviceViewport: 'iphone',
    });

    const saved = getDevToolsSettings();
    assert.strictEqual(saved.simulatedDelayMs, 400);
    assert.strictEqual(saved.deviceViewport, 'iphone');
  });

  test('fetches live events through offline fallback when backend is unreachable', async () => {
    const res: any = await apiRequest('/events');
    assert.strictEqual(res.success, true);
    assert.ok(Array.isArray(res.data));
    assert.ok(res.data.length >= 6);
  });

  test('filters events by search query in offline fallback', async () => {
    const res: any = await apiRequest('/events?search=Zidane');
    assert.strictEqual(res.success, true);
    assert.ok(res.data.length > 0);
    for (const e of res.data) {
      assert.ok(e.title.includes('Zidane') || e.tags.includes('Zidane'));
    }
  });

  test('creates new event in offline fallback store', async () => {
    const res: any = await apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Offline Cup',
        description: 'Test cup',
        endDate: new Date(Date.now() + 100000).toISOString(),
        type: 'TOURNAMENT',
        status: 'ACTIVE',
        tags: ['Offline'],
      }),
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.title, 'Offline Cup');
  });

  test('updates and deletes event in offline fallback store', async () => {
    const updateRes: any = await apiRequest('/events/evt-toty-2026', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'PAUSED' }),
    });
    assert.strictEqual(updateRes.success, true);
    assert.strictEqual(updateRes.data.status, 'PAUSED');

    const deleteRes: any = await apiRequest('/events/evt-toty-2026', {
      method: 'DELETE',
    });
    assert.strictEqual(deleteRes.success, true);
  });

  test('queries players with position and minOvr filters in offline fallback', async () => {
    const res: any = await apiRequest('/players?position=ST&minOvr=96');
    assert.strictEqual(res.success, true);
    for (const p of res.data) {
      assert.strictEqual(p.position, 'ST');
      assert.ok(p.ovr >= 96);
    }
  });

  test('toggles player live form boost in offline fallback', async () => {
    const res: any = await apiRequest('/players/ply-mbappe/boost', { method: 'PATCH' });
    assert.strictEqual(res.success, true);
    assert.ok(res.data);
    assert.strictEqual(typeof res.data.isLiveBoostActive, 'boolean');
  });

  test('fetches liveops metrics, packs, and audit logs', async () => {
    const metricsRes: any = await apiRequest('/liveops/metrics');
    assert.strictEqual(metricsRes.success, true);
    assert.ok(metricsRes.data.ccuCurrent > 0);

    const packsRes: any = await apiRequest('/liveops/packs');
    assert.strictEqual(packsRes.success, true);
    assert.ok(packsRes.data.length >= 4);

    const auditRes: any = await apiRequest('/liveops/audit-log');
    assert.strictEqual(auditRes.success, true);
    assert.ok(auditRes.data.length > 0);
  });

  test('simulates pack pull with walkout determination in offline fallback', async () => {
    const res: any = await apiRequest('/liveops/packs/simulate-pull', {
      method: 'POST',
      body: JSON.stringify({ packId: 'pack-toty-ultimate' }),
    });

    assert.strictEqual(res.success, true);
    assert.ok(res.data.player);
    assert.strictEqual(res.data.isWalkout, res.data.player.ovr >= 95);
  });

  test('simulates 500 error when simulateError is enabled in DevTools settings', async () => {
    saveDevToolsSettings({
      simulatedDelayMs: 0,
      simulateError: true,
      virtualizationEnabled: true,
      deviceViewport: 'native',
    });

    await assert.rejects(
      async () => {
        await apiRequest('/events');
      },
      /Simulated 500 Error/
    );
  });
});

