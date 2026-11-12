import { useState, useEffect } from 'react';

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  isUrgent: boolean; // < 24h
  isCritical: boolean; // < 4h
  isExpired: boolean;
}

export function useCountdown(targetIsoDate: string): CountdownResult {
  const calculate = (): CountdownResult => {
    const target = new Date(targetIsoDate).getTime();
    const now = Date.now();
    const diff = target - now;

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
    const formatted = days > 0
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
  };

  const [countdown, setCountdown] = useState<CountdownResult>(calculate);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetIsoDate]);

  return countdown;
}
