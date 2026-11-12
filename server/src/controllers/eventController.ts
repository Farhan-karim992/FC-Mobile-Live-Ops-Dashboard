import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';
import { EventStatus, EventType } from '../types';

export const getEvents = (req: Request, res: Response) => {
  try {
    let events = db.getEvents();

    const { search, status, type, sort, order } = req.query;

    // Search filter
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      events = events.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.subtitle.toLowerCase().includes(q) ||
          e.tags.some(t => t.toLowerCase().includes(q)) ||
          e.rewardTier.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (status && typeof status === 'string' && status !== 'ALL') {
      events = events.filter(e => e.status === (status.toUpperCase() as EventStatus));
    }

    // Type filter
    if (type && typeof type === 'string' && type !== 'ALL') {
      events = events.filter(e => e.type === (type.toUpperCase() as EventType));
    }

    // Sorting
    if (sort && typeof sort === 'string') {
      const isAsc = order === 'asc';
      events = [...events].sort((a, b) => {
        if (sort === 'endDate') {
          return isAsc
            ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
            : new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        }
        if (sort === 'participants') {
          return isAsc ? a.participantCount - b.participantCount : b.participantCount - a.participantCount;
        }
        if (sort === 'title') {
          return isAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        }
        if (sort === 'progress') {
          return isAsc ? a.progressPercentage - b.progressPercentage : b.progressPercentage - a.progressPercentage;
        }
        return 0;
      });
    }

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getEventById = (req: Request, res: Response) => {
  const { id } = req.params;
  const event = db.getEventById(id);
  if (!event) {
    return res.status(404).json({ success: false, error: `Event with id '${id}' not found` });
  }
  res.json({ success: true, data: event });
};

export const createEvent = (req: Request, res: Response) => {
  try {
    const { title, subtitle, bannerUrl, type, status, priority, startDate, endDate, description, rewardTier, tags, requirements } = req.body;

    if (!title || !description || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required event fields: title, description, and endDate are mandatory.',
      });
    }

    const newEvent = db.createEvent({
      title,
      subtitle: subtitle || 'New Live-Ops Campaign',
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      type: type || 'PROMO',
      status: status || 'ACTIVE',
      priority: priority || 'NORMAL',
      startDate: startDate || new Date().toISOString(),
      endDate,
      resetTimeDailyUtc: '19:00 UTC',
      description,
      rewardTier: rewardTier || 'Standard Reward Pack',
      featuredPlayerIds: [],
      tags: Array.isArray(tags) ? tags : ['LiveOps', 'Event'],
      requirements: requirements || { minOvr: 80, energyCostPerMatch: 10 },
    });

    res.status(201).json({ success: true, data: newEvent });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateEvent = (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateEvent(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: `Event with id '${id}' not found` });
  }
  res.json({ success: true, data: updated });
};

export const deleteEvent = (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteEvent(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: `Event with id '${id}' not found` });
  }
  res.json({ success: true, message: `Event '${id}' successfully removed` });
};
