import { Request, Response, NextFunction } from 'express';

export const networkSimulatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check for artificial delay header or query param
  const delayParam = req.headers['x-simulate-delay'] || req.query._delay;
  const delayMs = delayParam ? parseInt(String(delayParam), 10) : 0;

  // Check for simulated error header or query param
  const shouldError = req.headers['x-simulate-error'] === 'true' || req.query._error === 'true';

  if (shouldError) {
    console.warn(`[LiveOps DevTools] Simulating 500 Internal Server Error for ${req.method} ${req.originalUrl}`);
    return res.status(500).json({
      success: false,
      error: 'Simulated 500 Server Error (Triggered via DevTools Network Simulator)',
      hint: 'Disable simulated error in DevTools panel to restore normal API responses.',
      timestamp: new Date().toISOString(),
    });
  }

  if (delayMs > 0) {
    console.log(`[LiveOps DevTools] Simulating ${delayMs}ms network latency for ${req.method} ${req.originalUrl}`);
    setTimeout(() => {
      next();
    }, delayMs);
  } else {
    next();
  }
};

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal LiveOps Server Error',
    timestamp: new Date().toISOString(),
  });
};

