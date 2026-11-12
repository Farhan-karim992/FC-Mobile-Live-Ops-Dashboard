import { LiveEvent, EventStatus, EventCategory } from '../types';

export interface EventValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEvent(event: Partial<LiveEvent>): EventValidationResult {
  const errors: string[] = [];

  if (!event.title || !event.title.trim()) {
    errors.push('Event title cannot be empty.');
  }

  if (!event.startDate) {
    errors.push('Start date is required.');
  }

  if (!event.endDate) {
    errors.push('End date is required.');
  }

  const startTime = new Date(event.startDate || '').getTime();
  const endTime = new Date(event.endDate || '').getTime();

  if (isNaN(startTime)) {
    errors.push('Start date is invalid.');
  }

  if (isNaN(endTime)) {
    errors.push('End date is invalid.');
  }

  if (!isNaN(startTime) && !isNaN(endTime) && endTime <= startTime) {
    errors.push('End date must be scheduled after start date (End Date <= Start Date).');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function deriveEventStatus(event: LiveEvent, now: number = Date.now()): EventStatus {
  const validation = validateEvent(event);
  if (!validation.isValid) {
    return 'MISCONFIGURED';
  }

  if (event.status === 'PAUSED') {
    return 'PAUSED';
  }

  const startTime = new Date(event.startDate).getTime();
  const endTime = new Date(event.endDate).getTime();

  if (now < startTime) {
    return 'UPCOMING';
  } else if (now >= startTime && now <= endTime) {
    return 'ACTIVE';
  } else {
    return 'CONCLUDED';
  }
}
