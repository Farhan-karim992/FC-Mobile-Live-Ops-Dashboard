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

  // Operator manual pause overrides dynamic active status
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

export interface DashboardKPIs {
  totalEvents: number;
  activeEvents: number;
  upcomingEvents: number;
  expiredEvents: number;
  pausedEvents: number;
  misconfiguredEvents: number;
  approachingDeadlines: number;
  recentlyUpdated: number;
  categoryBreakdown: Record<EventCategory, number>;
  statusBreakdown: Record<EventStatus, number>;
}

export function calculateDashboardKPIs(events: LiveEvent[], now: number = Date.now()): DashboardKPIs {
  let activeEvents = 0;
  let upcomingEvents = 0;
  let expiredEvents = 0;
  let pausedEvents = 0;
  let misconfiguredEvents = 0;
  let approachingDeadlines = 0;
  let recentlyUpdated = 0;

  const categoryBreakdown: Record<EventCategory, number> = {
    SEASONAL: 0,
    SPECIAL: 0,
    TOURNAMENT: 0,
    FLASH_SALE: 0,
    CHALLENGE: 0,
    MILESTONE: 0,
  };

  const statusBreakdown: Record<EventStatus, number> = {
    ACTIVE: 0,
    UPCOMING: 0,
    CONCLUDED: 0,
    PAUSED: 0,
    MISCONFIGURED: 0,
  };

  const fortyEightHoursAgo = now - 48 * 3600 * 1000;
  const twentyFourHoursFromNow = now + 24 * 3600 * 1000;

  for (const event of events) {
    const computedStatus = deriveEventStatus(event, now);
    statusBreakdown[computedStatus] = (statusBreakdown[computedStatus] || 0) + 1;

    // Category tally
    const cat = event.category || (event.type as EventCategory) || 'SPECIAL';
    if (categoryBreakdown[cat] !== undefined) {
      categoryBreakdown[cat]++;
    }

    if (computedStatus === 'ACTIVE') activeEvents++;
    else if (computedStatus === 'UPCOMING') upcomingEvents++;
    else if (computedStatus === 'CONCLUDED') expiredEvents++;
    else if (computedStatus === 'PAUSED') pausedEvents++;
    else if (computedStatus === 'MISCONFIGURED') misconfiguredEvents++;

    // Approaching deadline check (< 24 hours remaining on active event)
    const end = new Date(event.endDate).getTime();
    if (computedStatus === 'ACTIVE' && end > now && end <= twentyFourHoursFromNow) {
      approachingDeadlines++;
    }

    // Recently updated check
    const updated = new Date(event.updatedAt || event.startDate).getTime();
    if (!isNaN(updated) && updated >= fortyEightHoursAgo) {
      recentlyUpdated++;
    }
  }

  return {
    totalEvents: events.length,
    activeEvents,
    upcomingEvents,
    expiredEvents,
    pausedEvents,
    misconfiguredEvents,
    approachingDeadlines,
    recentlyUpdated,
    categoryBreakdown,
    statusBreakdown,
  };
}

