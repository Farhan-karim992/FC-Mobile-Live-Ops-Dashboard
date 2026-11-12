import test, { describe } from 'node:test';
import assert from 'node:assert';

// Pure countdown calculation function mirrored from useCountdown hook
function calculateCountdown(targetIsoDate: string, nowMs: number) {
  const target = new Date(targetIsoDate).getTime();
  const diff = target - nowMs;

  if (diff <= 0 || isNaN(target)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: '00d 00h 00m 00s',
      isUrgent: false,
      isCritical: false,
      isExpired: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted =
    days > 0
      ? `${days}d ${pad(hours)}h ${pad(minutes)}m`
      : `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

  return {
    days,
    hours,
    minutes,
    seconds,
    formatted,
    isUrgent: diff < 24 * 3600 * 1000,
    isCritical: diff < 4 * 3600 * 1000,
    isExpired: false,
  };
}

describe('Countdown Timer Logic & Urgency Thresholds', () => {
  const now = 1700000000000; // fixed epoch timestamp for deterministic tests

  test('calculates correct days, hours, and minutes for events > 24 hours away', () => {
    // 3 days, 5 hours, 10 minutes, 20 seconds later
    const future = now + (3 * 86400 + 5 * 3600 + 10 * 60 + 20) * 1000;
    const res = calculateCountdown(new Date(future).toISOString(), now);

    assert.strictEqual(res.days, 3);
    assert.strictEqual(res.hours, 5);
    assert.strictEqual(res.minutes, 10);
    assert.strictEqual(res.seconds, 20);
    assert.strictEqual(res.formatted, '3d 05h 10m');
    assert.strictEqual(res.isUrgent, false);
    assert.strictEqual(res.isCritical, false);
    assert.strictEqual(res.isExpired, false);
  });

  test('flags isUrgent = true when time remaining is under 24 hours', () => {
    // 12 hours later
    const future = now + 12 * 3600 * 1000;
    const res = calculateCountdown(new Date(future).toISOString(), now);

    assert.strictEqual(res.days, 0);
    assert.strictEqual(res.hours, 12);
    assert.strictEqual(res.isUrgent, true);
    assert.strictEqual(res.isCritical, false);
    assert.strictEqual(res.isExpired, false);
    assert.strictEqual(res.formatted, '12h 00m 00s');
  });

  test('flags isCritical = true when time remaining is under 4 hours (Flash sale)', () => {
    // 2 hours, 30 minutes later
    const future = now + (2 * 3600 + 30 * 60) * 1000;
    const res = calculateCountdown(new Date(future).toISOString(), now);

    assert.strictEqual(res.days, 0);
    assert.strictEqual(res.hours, 2);
    assert.strictEqual(res.minutes, 30);
    assert.strictEqual(res.isUrgent, true);
    assert.strictEqual(res.isCritical, true);
    assert.strictEqual(res.isExpired, false);
  });

  test('flags isExpired = true for past or invalid dates', () => {
    const past = now - 50000;
    const res = calculateCountdown(new Date(past).toISOString(), now);

    assert.strictEqual(res.days, 0);
    assert.strictEqual(res.hours, 0);
    assert.strictEqual(res.isExpired, true);
    assert.strictEqual(res.formatted, '00d 00h 00m 00s');

    const invalid = calculateCountdown('invalid-date-string', now);
    assert.strictEqual(invalid.isExpired, true);
  });
});
