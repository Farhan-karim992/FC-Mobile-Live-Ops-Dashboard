import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';

export const getMetrics = (_req: Request, res: Response) => {
  try {
    const metrics = db.getMetrics();
    res.json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBroadcasts = (_req: Request, res: Response) => {
  try {
    const broadcasts = db.getBroadcasts();
    res.json({ success: true, data: broadcasts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createBroadcast = (req: Request, res: Response) => {
  try {
    const { title, message, type, targetClientVersion, expiresAt } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Title and message are required' });
    }
    const newBc = db.createBroadcast({
      title,
      message,
      type: type || 'PROMO',
      isActive: true,
      targetClientVersion: targetClientVersion || 'All',
      expiresAt: expiresAt || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    });
    res.status(201).json({ success: true, data: newBc });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBroadcast = (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteBroadcast(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: `Broadcast '${id}' not found` });
  }
  res.json({ success: true, message: `Broadcast '${id}' removed` });
};

export const getPacks = (_req: Request, res: Response) => {
  try {
    const packs = db.getPacks();
    res.json({ success: true, data: packs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const simulatePackPull = (req: Request, res: Response) => {
  try {
    const { packId } = req.body;
    const result = db.simulatePackPull(packId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAuditLogs = (_req: Request, res: Response) => {
  try {
    const logs = db.getAuditLogs();
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const resetData = (_req: Request, res: Response) => {
  try {
    db.resetAll();
    res.json({ success: true, message: 'All live-ops databases reset to initial factory state.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

