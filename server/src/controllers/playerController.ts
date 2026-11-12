import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';
import { CardRarity, PlayerPosition } from '../types';

export const getPlayers = (req: Request, res: Response) => {
  try {
    let players = db.getPlayers();

    const { search, position, cardType, minOvr, maxOvr, sort, order } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      players = players.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.knownAs.toLowerCase().includes(q) ||
          p.club.toLowerCase().includes(q) ||
          p.nation.toLowerCase().includes(q) ||
          p.league.toLowerCase().includes(q)
      );
    }

    if (position && typeof position === 'string' && position !== 'ALL') {
      players = players.filter(p => p.position === (position as PlayerPosition));
    }

    if (cardType && typeof cardType === 'string' && cardType !== 'ALL') {
      players = players.filter(p => p.cardType === (cardType as CardRarity));
    }

    if (minOvr) {
      const min = parseInt(String(minOvr), 10);
      if (!isNaN(min)) players = players.filter(p => p.ovr >= min);
    }

    if (maxOvr) {
      const max = parseInt(String(maxOvr), 10);
      if (!isNaN(max)) players = players.filter(p => p.ovr <= max);
    }

    if (sort && typeof sort === 'string') {
      const isAsc = order === 'asc';
      players = [...players].sort((a, b) => {
        if (sort === 'ovr') {
          return isAsc ? a.ovr - b.ovr : b.ovr - a.ovr;
        }
        if (sort === 'marketPrice') {
          return isAsc ? a.marketPrice - b.marketPrice : b.marketPrice - a.marketPrice;
        }
        if (sort === 'name') {
          return isAsc ? a.knownAs.localeCompare(b.knownAs) : b.knownAs.localeCompare(a.knownAs);
        }
        if (sort === 'pace') {
          return isAsc ? a.stats.pace - b.stats.pace : b.stats.pace - a.stats.pace;
        }
        return 0;
      });
    }

    res.json({
      success: true,
      count: players.length,
      data: players,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPlayerById = (req: Request, res: Response) => {
  const { id } = req.params;
  const player = db.getPlayerById(id);
  if (!player) {
    return res.status(404).json({ success: false, error: `Player with id '${id}' not found` });
  }
  res.json({ success: true, data: player });
};

export const togglePlayerBoost = (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.togglePlayerBoost(id);
  if (!updated) {
    return res.status(404).json({ success: false, error: `Player with id '${id}' not found` });
  }
  res.json({
    success: true,
    data: updated,
    message: `${updated.knownAs} form boost ${updated.isLiveBoostActive ? 'activated (+2 OVR)' : 'deactivated'}`,
  });
};

