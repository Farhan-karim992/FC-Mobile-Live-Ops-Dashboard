import test, { describe } from 'node:test';
import assert from 'node:assert';
import { FALLBACK_PACKS } from '../src/data/mockClientData';

const formatParticipants = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

const formatPrice = (p: number) => {
  if (p >= 1000000) return `${(p / 1000000).toFixed(1)}M`;
  if (p >= 1000) return `${(p / 1000).toFixed(0)}K`;
  return p.toLocaleString();
};

describe('UI Formatting & Mathematics', () => {
  test('formats participant counts into human-readable mobile tiers', () => {
    assert.strictEqual(formatParticipants(2840500), '2.8M');
    assert.strictEqual(formatParticipants(450100), '450K');
    assert.strictEqual(formatParticipants(850), '850');
    assert.strictEqual(formatParticipants(0), '0');
  });

  test('formats market coin prices into M and K abbreviations', () => {
    assert.strictEqual(formatPrice(145000000), '145.0M');
    assert.strictEqual(formatPrice(89000000), '89.0M');
    assert.strictEqual(formatPrice(75000), '75K');
  });

  test('verifies all store pack odds comply with regulatory 100% total', () => {
    for (const pack of FALLBACK_PACKS) {
      const sum = pack.dropRates.reduce((acc, t) => acc + t.chancePercentage, 0);
      assert.ok(Math.abs(sum - 100) < 0.01, `Pack ${pack.name} drop probabilities must sum to 100%`);
    }
  });
});
