import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { db } from '../src/data/mockDatabase';

describe('MockDatabase In-Memory Store & Domain Operations', () => {
  beforeEach(() => {
    db.resetAll();
  });

  test('should return all initial seeded live events', () => {
    const events = db.getEvents();
    assert.ok(Array.isArray(events));
    assert.ok(events.length >= 6);

    const toty = events.find(e => e.id === 'evt-toty-2026');
    assert.ok(toty);
    assert.strictEqual(toty.title, 'Team of the Year (TOTY) Ultimate Chapter');
    assert.strictEqual(toty.status, 'ACTIVE');
    assert.strictEqual(toty.priority, 'CRITICAL');
  });

  test('should retrieve an event by ID or return undefined for invalid ID', () => {
    const event = db.getEventById('evt-ucl-rttf');
    assert.ok(event);
    assert.strictEqual(event.type, 'TOURNAMENT');

    const nonExistent = db.getEventById('evt-does-not-exist');
    assert.strictEqual(nonExistent, undefined);
  });

  test('should create a new live-ops event and record in audit log', () => {
    const initialLogsCount = db.getAuditLogs().length;
    const newEvent = db.createEvent({
      title: 'Neon Nights: Midnight Blitz',
      subtitle: '24-hour midnight challenges',
      bannerUrl: 'https://images.unsplash.com/photo-test',
      type: 'FLASH_SALE',
      status: 'ACTIVE',
      priority: 'HIGH',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      description: 'Blitz matches with double coins',
      rewardTier: '95+ OVR Neon Card',
      featuredPlayerIds: [],
      tags: ['Neon', 'Blitz'],
      requirements: { minOvr: 85, energyCostPerMatch: 10 },
    });

    assert.ok(newEvent.id.startsWith('evt-'));
    assert.strictEqual(newEvent.title, 'Neon Nights: Midnight Blitz');
    assert.strictEqual(newEvent.participantCount, 0);
    assert.strictEqual(newEvent.progressPercentage, 0);

    const fetched = db.getEventById(newEvent.id);
    assert.ok(fetched);

    const logs = db.getAuditLogs();
    assert.strictEqual(logs.length, initialLogsCount + 1);
    assert.ok(logs[0].details.includes('Neon Nights: Midnight Blitz'));
  });

  test('should update existing event fields and return updated object', () => {
    const updated = db.updateEvent('evt-toty-2026', {
      status: 'PAUSED',
      subtitle: 'Emergency maintenance pause',
    });

    assert.ok(updated);
    assert.strictEqual(updated.status, 'PAUSED');
    assert.strictEqual(updated.subtitle, 'Emergency maintenance pause');

    const fetched = db.getEventById('evt-toty-2026');
    assert.strictEqual(fetched?.status, 'PAUSED');

    const notFound = db.updateEvent('invalid-id', { status: 'ACTIVE' });
    assert.strictEqual(notFound, null);
  });

  test('should delete an event and verify it is no longer retrievable', () => {
    const existsBefore = db.getEventById('evt-toty-2026');
    assert.ok(existsBefore);

    const deleted = db.deleteEvent('evt-toty-2026');
    assert.strictEqual(deleted, true);

    const existsAfter = db.getEventById('evt-toty-2026');
    assert.strictEqual(existsAfter, undefined);

    const deleteAgain = db.deleteEvent('evt-toty-2026');
    assert.strictEqual(deleteAgain, false);
  });

  test('should retrieve players and verify initial TOTY, Icon, and Hero roster', () => {
    const players = db.getPlayers();
    assert.ok(Array.isArray(players));
    assert.ok(players.length >= 10);

    const mbappe = players.find(p => p.id === 'ply-mbappe');
    assert.ok(mbappe);
    assert.strictEqual(mbappe.name, 'Kylian Mbappé');
    assert.strictEqual(mbappe.position, 'ST');
    assert.strictEqual(mbappe.stats.pace, 99);
  });

  test('should toggle live form boost on a player card', () => {
    const haaland = db.getPlayerById('ply-haaland');
    assert.ok(haaland);
    assert.strictEqual(haaland.isLiveBoostActive, false);
    assert.strictEqual(haaland.ovr, 96);
    assert.strictEqual(haaland.baseOvr, 96);

    // Toggle ON
    const boosted = db.togglePlayerBoost('ply-haaland');
    assert.ok(boosted);
    assert.strictEqual(boosted.isLiveBoostActive, true);
    assert.strictEqual(boosted.boostAmount, 2);
    assert.strictEqual(boosted.ovr, 98); // 96 + 2

    // Toggle OFF
    const unboosted = db.togglePlayerBoost('ply-haaland');
    assert.ok(unboosted);
    assert.strictEqual(unboosted.isLiveBoostActive, false);
    assert.strictEqual(unboosted.boostAmount, 0);
    assert.strictEqual(unboosted.ovr, 96);

    // Non-existent player
    const invalid = db.togglePlayerBoost('non-existent');
    assert.strictEqual(invalid, null);
  });

  test('should retrieve store packs and verify probability constraints', () => {
    const packs = db.getPacks();
    assert.ok(Array.isArray(packs));
    assert.ok(packs.length >= 4);

    for (const pack of packs) {
      assert.ok(pack.id);
      assert.ok(pack.cost > 0);
      assert.ok(pack.guaranteedMinOvr >= 80);

      // Verify drop percentages sum to 100% (within floating point precision)
      const totalChance = pack.dropRates.reduce((acc, tier) => acc + tier.chancePercentage, 0);
      assert.ok(Math.abs(totalChance - 100) < 0.1, `Pack ${pack.name} total drop chance must equal 100%`);
    }
  });

  test('should simulate pack pull with walkout determination', () => {
    const result = db.simulatePackPull('pack-toty-ultimate');
    assert.ok(result);
    assert.ok(result.player);
    assert.ok(result.player.ovr >= 95, 'Pack guarantees minimum 95 OVR');
    assert.ok(result.rarityTier);
    assert.strictEqual(typeof result.isWalkout, 'boolean');
    assert.strictEqual(result.isWalkout, result.player.ovr >= 95);
  });

  test('should manage broadcasts: create, retrieve, and delete', () => {
    const newBc = db.createBroadcast({
      title: 'Server Hotfix Deployed',
      message: 'Client matchmaking latency reduced.',
      type: 'MAINTENANCE',
      isActive: true,
      targetClientVersion: '>=2.4.1',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    assert.ok(newBc.id.startsWith('bc-'));
    assert.strictEqual(newBc.title, 'Server Hotfix Deployed');

    const broadcasts = db.getBroadcasts();
    assert.ok(broadcasts.some(b => b.id === newBc.id));

    const deleted = db.deleteBroadcast(newBc.id);
    assert.strictEqual(deleted, true);

    const broadcastsAfter = db.getBroadcasts();
    assert.ok(!broadcastsAfter.some(b => b.id === newBc.id));
  });

  test('should retrieve live-ops telemetry metrics across 5 server regions', () => {
    const metrics = db.getMetrics();
    assert.ok(metrics.ccuCurrent > 0);
    assert.ok(metrics.ccuPeakToday >= metrics.ccuCurrent);
    assert.ok(metrics.serverHealth.length === 5);

    const regions = metrics.serverHealth.map(s => s.region);
    assert.ok(regions.some(r => r.includes('North America')));
    assert.ok(regions.some(r => r.includes('Europe West')));
    assert.ok(regions.some(r => r.includes('Asia Pacific')));
    assert.ok(regions.some(r => r.includes('South America')));
    assert.ok(regions.some(r => r.includes('Middle East')));

    for (const node of metrics.serverHealth) {
      assert.ok(node.pingMs > 0 && node.pingMs < 100);
      assert.ok(node.loadPercentage >= 0 && node.loadPercentage <= 100);
    }
  });

  test('should record and cap audit log entries', () => {
    for (let i = 0; i < 60; i++) {
      db.addAuditLog('TEST_BOT', `ACTION_${i}`, 'EVENT', `Test details ${i}`);
    }

    const logs = db.getAuditLogs();
    assert.strictEqual(logs.length, 50, 'Audit logs must cap at 50 entries max');
    assert.strictEqual(logs[0].action, 'ACTION_59');
  });

  test('should reset database back to factory state', () => {
    db.createEvent({
      title: 'Temp Event',
      subtitle: '',
      bannerUrl: '',
      type: 'PROMO',
      status: 'ACTIVE',
      priority: 'NORMAL',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      description: 'Temp',
      rewardTier: 'None',
      featuredPlayerIds: [],
      tags: [],
      requirements: { minOvr: 70 },
    });

    const countBeforeReset = db.getEvents().length;
    db.resetAll();
    const countAfterReset = db.getEvents().length;

    assert.ok(countAfterReset < countBeforeReset);
    assert.strictEqual(countAfterReset, 8); // initial 8 seeded events
  });
});
