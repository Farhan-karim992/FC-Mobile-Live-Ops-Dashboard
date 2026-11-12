import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { db } from '../src/data/mockDatabase';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../src/controllers/eventController';
import {
  getPlayers,
  getPlayerById,
  togglePlayerBoost,
} from '../src/controllers/playerController';
import {
  getMetrics,
  getBroadcasts,
  createBroadcast,
  deleteBroadcast,
  getPacks,
  simulatePackPull,
  getAuditLogs,
  resetData,
} from '../src/controllers/liveopsController';

// Helper to mock Express Request and Response
const createMockReq = (overrides = {}): any => ({
  query: {},
  params: {},
  body: {},
  headers: {},
  ...overrides,
});

const createMockRes = (): any => {
  const res: any = {
    statusCode: 200,
    data: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.data = payload;
      return this;
    },
  };
  return res;
};

describe('REST API Controller Handlers', () => {
  beforeEach(() => {
    db.resetAll();
  });

  describe('eventController', () => {
    test('getEvents returns all events by default', () => {
      const req = createMockReq();
      const res = createMockRes();
      getEvents(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.count >= 6);
    });

    test('getEvents filters by keyword search', () => {
      const req = createMockReq({ query: { search: 'TOTY' } });
      const res = createMockRes();
      getEvents(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.data.data.length > 0);
      for (const e of res.data.data) {
        const matches = e.title.includes('TOTY') || e.tags.includes('TOTY') || e.rewardTier.includes('TOTY');
        assert.ok(matches);
      }
    });

    test('getEvents filters by status', () => {
      const req = createMockReq({ query: { status: 'PAUSED' } });
      const res = createMockRes();
      getEvents(req, res);

      assert.strictEqual(res.statusCode, 200);
      for (const e of res.data.data) {
        assert.strictEqual(e.status, 'PAUSED');
      }
    });

    test('getEvents filters by type', () => {
      const req = createMockReq({ query: { type: 'FLASH_SALE' } });
      const res = createMockRes();
      getEvents(req, res);

      assert.strictEqual(res.statusCode, 200);
      for (const e of res.data.data) {
        assert.strictEqual(e.type, 'FLASH_SALE');
      }
    });

    test('getEvents sorts by participant count descending', () => {
      const req = createMockReq({ query: { sort: 'participants', order: 'desc' } });
      const res = createMockRes();
      getEvents(req, res);

      assert.strictEqual(res.statusCode, 200);
      const items = res.data.data;
      for (let i = 0; i < items.length - 1; i++) {
        assert.ok(items[i].participantCount >= items[i + 1].participantCount);
      }
    });

    test('getEventById returns 404 for invalid ID', () => {
      const req = createMockReq({ params: { id: 'non-existent-id' } });
      const res = createMockRes();
      getEventById(req, res);

      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.error.includes('not found'));
    });

    test('createEvent returns 400 when missing required fields', () => {
      const req = createMockReq({ body: { title: 'Missing description and end date' } });
      const res = createMockRes();
      createEvent(req, res);

      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.data.success, false);
    });

    test('createEvent returns 201 on valid submission', () => {
      const req = createMockReq({
        body: {
          title: 'Weekend Gauntlet',
          description: 'Win 5 in a row',
          endDate: new Date(Date.now() + 100000).toISOString(),
          type: 'CHALLENGE',
        },
      });
      const res = createMockRes();
      createEvent(req, res);

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.title, 'Weekend Gauntlet');
    });

    test('updateEvent returns 200 and applies partial update', () => {
      const req = createMockReq({
        params: { id: 'evt-toty-2026' },
        body: { status: 'PAUSED' },
      });
      const res = createMockRes();
      updateEvent(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.data.status, 'PAUSED');
    });

    test('deleteEvent returns 200 on success, 404 on repeat', () => {
      const req = createMockReq({ params: { id: 'evt-toty-2026' } });
      const res1 = createMockRes();
      deleteEvent(req, res1);

      assert.strictEqual(res1.statusCode, 200);
      assert.strictEqual(res1.data.success, true);

      const res2 = createMockRes();
      deleteEvent(req, res2);
      assert.strictEqual(res2.statusCode, 404);
    });
  });

  describe('playerController', () => {
    test('getPlayers filters by position and rarity', () => {
      const req = createMockReq({ query: { position: 'ST', cardType: 'TOTY' } });
      const res = createMockRes();
      getPlayers(req, res);

      assert.strictEqual(res.statusCode, 200);
      for (const p of res.data.data) {
        assert.strictEqual(p.position, 'ST');
        assert.strictEqual(p.cardType, 'TOTY');
      }
    });

    test('getPlayers filters by OVR range', () => {
      const req = createMockReq({ query: { minOvr: '97', maxOvr: '99' } });
      const res = createMockRes();
      getPlayers(req, res);

      assert.strictEqual(res.statusCode, 200);
      for (const p of res.data.data) {
        assert.ok(p.ovr >= 97 && p.ovr <= 99);
      }
    });

    test('togglePlayerBoost activates and deactivates boost', () => {
      const req = createMockReq({ params: { id: 'ply-mbappe' } });
      const res = createMockRes();
      togglePlayerBoost(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(typeof res.data.data.isLiveBoostActive, 'boolean');
    });
  });

  describe('liveopsController', () => {
    test('getMetrics returns telemetry stats', () => {
      const req = createMockReq();
      const res = createMockRes();
      getMetrics(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.ccuCurrent > 0);
    });

    test('createBroadcast validates and inserts announcement', () => {
      const reqMissing = createMockReq({ body: { title: 'No message' } });
      const resMissing = createMockRes();
      createBroadcast(reqMissing, resMissing);
      assert.strictEqual(resMissing.statusCode, 400);

      const reqValid = createMockReq({
        body: {
          title: 'Special Maintenance',
          message: 'Servers updating at 04:00 UTC',
          type: 'MAINTENANCE',
        },
      });
      const resValid = createMockRes();
      createBroadcast(reqValid, resValid);
      assert.strictEqual(resValid.statusCode, 201);
      assert.strictEqual(resValid.data.data.title, 'Special Maintenance');
    });

    test('simulatePackPull generates weighted drop item', () => {
      const req = createMockReq({ body: { packId: 'pack-toty-ultimate' } });
      const res = createMockRes();
      simulatePackPull(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.player);
      assert.ok(res.data.data.rarityTier);
    });

    test('resetData resets entire mock DB', () => {
      const req = createMockReq();
      const res = createMockRes();
      resetData(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
    });
  });
});
