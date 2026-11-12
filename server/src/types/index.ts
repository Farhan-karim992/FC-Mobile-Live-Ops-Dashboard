export type EventType = 'PROMO' | 'TOURNAMENT' | 'FLASH_SALE' | 'CHALLENGE' | 'MILESTONE';

export type EventStatus = 'ACTIVE' | 'UPCOMING' | 'CONCLUDED' | 'PAUSED';

export type EventPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL';

export interface LiveEvent {
  id: string;
  title: string;
  subtitle: string;
  bannerUrl: string;
  type: EventType;
  status: EventStatus;
  priority: EventPriority;
  startDate: string; // ISO
  endDate: string; // ISO
  resetTimeDailyUtc?: string; // e.g. "19:00 UTC"
  description: string;
  rewardTier: string;
  featuredPlayerIds: string[];
  participantCount: number;
  progressPercentage: number;
  tags: string[];
  requirements: {
    minOvr: number;
    requiredLeague?: string;
    energyCostPerMatch?: number;
  };
  liveFormMultiplier?: number;
}

export type PlayerPosition = 'ST' | 'CF' | 'RW' | 'LW' | 'CAM' | 'CM' | 'CDM' | 'CB' | 'LB' | 'RB' | 'GK';

export type CardRarity = 'TOTY' | 'TOTS' | 'PRIME_ICON' | 'HERO' | 'UCL_RTTF' | 'RULEBREAKER' | 'BASE';

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerCard {
  id: string;
  name: string;
  knownAs: string;
  club: string;
  clubBadgeUrl: string;
  nation: string;
  nationFlagUrl: string;
  league: string;
  position: PlayerPosition;
  ovr: number;
  baseOvr: number;
  cardType: CardRarity;
  stats: PlayerStats;
  weakFoot: number; // 1-5
  skillMoves: number; // 1-5
  traits: string[];
  marketPrice: number;
  priceTrend: number[]; // 7 days history
  isLiveBoostActive: boolean;
  boostAmount: number;
  avatarUrl: string;
  workRate: string;
}

export interface ServerNodeHealth {
  region: string;
  cluster: string;
  pingMs: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'MAINTENANCE';
  loadPercentage: number;
}

export interface LiveOpsMetrics {
  ccuCurrent: number;
  ccuPeakToday: number;
  activeEventsCount: number;
  activeBannersCount: number;
  globalDropRateBonus: number;
  serverHealth: ServerNodeHealth[];
  errorRatePercentage: number;
  timestamp: string;
}

export interface PackDropTier {
  range: string;
  chancePercentage: number;
}

export interface StorePack {
  id: string;
  name: string;
  category: 'FEATURED' | 'FLASH' | 'DIVISION' | 'MILESTONE';
  costType: 'GEMS' | 'FC_POINTS' | 'COINS';
  cost: number;
  guaranteedMinOvr: number;
  expiryDate: string;
  bannerColor: string;
  description: string;
  dropRates: PackDropTier[];
  availableCount: number; // -1 for unlimited
  featuredPlayers: string[];
}

export interface BroadcastAlert {
  id: string;
  title: string;
  message: string;
  type: 'URGENT' | 'MAINTENANCE' | 'PROMO' | 'COMPENSATION';
  isActive: boolean;
  targetClientVersion: string;
  createdAt: string;
  expiresAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  category: 'EVENT' | 'STORE' | 'BROADCAST' | 'HOTFIX';
  details: string;
}

