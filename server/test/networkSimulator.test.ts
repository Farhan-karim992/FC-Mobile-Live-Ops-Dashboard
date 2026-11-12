import test, { describe } from 'node:test';
import assert from 'node:assert';
import { networkSimulatorMiddleware, errorHandler } from '../src/middleware/networkSimulator';

const createMockReq = (overrides = {}): any => ({
  query: {},
  params: {},
  body: {},
  headers: {},
  method: 'GET',
  originalUrl: '/api/events',
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

describe('Network Simulator & Error Middleware', () => {
  test('calls next() synchronously when no simulation flags are set', () => {
    const req = createMockReq();
    const res = createMockRes();
    let calledNext = false;

    networkSimulatorMiddleware(req, res, () => {
      calledNext = true;
    });

    assert.strictEqual(calledNext, true);
    assert.strictEqual(res.statusCode, 200);
  });

  test('intercepts with HTTP 500 when header x-simulate-error is true', () => {
    const req = createMockReq({ headers: { 'x-simulate-error': 'true' } });
    const res = createMockRes();
    let calledNext = false;

    networkSimulatorMiddleware(req, res, () => {
      calledNext = true;
    });

    assert.strictEqual(calledNext, false);
    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.error.includes('Simulated 500 Server Error'));
  });

  test('intercepts with HTTP 500 when query _error is true', () => {
    const req = createMockReq({ query: { _error: 'true' } });
    const res = createMockRes();
    let calledNext = false;

    networkSimulatorMiddleware(req, res, () => {
      calledNext = true;
    });

    assert.strictEqual(calledNext, false);
    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.data.success, false);
  });

  test('delays execution when x-simulate-delay is passed', async () => {
    const delayMs = 60;
    const req = createMockReq({ headers: { 'x-simulate-delay': delayMs.toString() } });
    const res = createMockRes();
    const start = Date.now();

    await new Promise<void>(resolve => {
      networkSimulatorMiddleware(req, res, () => {
        resolve();
      });
    });

    const elapsed = Date.now() - start;
    assert.ok(elapsed >= delayMs - 15, `Elapsed time ${elapsed}ms should approximate ${delayMs}ms`);
  });

  test('errorHandler middleware catches error and formats 500 response', () => {
    const req = createMockReq();
    const res = createMockRes();
    const err = new Error('Database connection crashed');

    errorHandler(err, req, res, () => {});

    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.error, 'Database connection crashed');
  });
});

