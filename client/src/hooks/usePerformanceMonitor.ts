import { useState, useEffect, useRef } from 'react';

export interface PerformanceStats {
  fps: number;
  domNodeCount: number;
  memoryMb?: number;
  lastRenderDurationMs: number;
}

export interface NetworkLogItem {
  url: string;
  method: string;
  status: number;
  duration: number;
  timestamp: string;
}

export function usePerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    domNodeCount: 0,
    lastRenderDurationMs: 0,
  });

  const [networkLogs, setNetworkLogs] = useState<NetworkLogItem[]>([]);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Measure FPS
    const loop = (now: number) => {
      frameCount.current++;
      if (now - lastTime.current >= 1000) {
        const calculatedFps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
        const domCount = document.querySelectorAll('*').length;
        
        let memory: number | undefined;
        // @ts-ignore
        if (performance.memory && performance.memory.usedJSHeapSize) {
          // @ts-ignore
          memory = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
        }

        setStats(prev => ({
          ...prev,
          fps: Math.min(120, calculatedFps),
          domNodeCount: domCount,
          memoryMb: memory,
        }));

        frameCount.current = 0;
        lastTime.current = now;
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    // Listen to network events dispatched by apiRequest
    const handleNetworkLog = (e: any) => {
      if (e.detail) {
        setNetworkLogs(prev => [e.detail, ...prev].slice(0, 15));
      }
    };

    window.addEventListener('api_request_logged', handleNetworkLog);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('api_request_logged', handleNetworkLog);
    };
  }, []);

  return { stats, networkLogs, clearLogs: () => setNetworkLogs([]) };
}

