export type EventCategory = 'SEASONAL' | 'SPECIAL' | 'TOURNAMENT' | 'FLASH_SALE' | 'CHALLENGE' | 'MILESTONE';

export type EventStatus = 'ACTIVE' | 'UPCOMING' | 'CONCLUDED' | 'PAUSED' | 'MISCONFIGURED';

export type EventPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL';

export interface LiveEvent {
  id: string;
  title: string;
  subtitle: string;
  bannerUrl: string;
  category: EventCategory;
  type?: EventCategory; // alias
  status: EventStatus;
  priority: EventPriority;
  isFeatured: boolean;
  startDate: string;
  endDate: string;
  resetTimeDailyUtc?: string;
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
  updatedAt: string;
  updatedBy: string;
  validationErrors?: string[];
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
  weakFoot: number;
  skillMoves: number;
  traits: string[];
  marketPrice: number;
  priceTrend: number[];
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
  totalEvents: number;
  activeEventsCount: number;
  upcomingEventsCount: number;
  expiredEventsCount: number;
  misconfiguredCount: number;
  approachingDeadlineCount: number;
  ccuCurrent: number;
  ccuPeakToday: number;
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
  availableCount: number;
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

export interface EventFilterState {
  search: string;
  status: string;
  category: string;
  type?: string;
  sort: string;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface PlayerFilterState {
  search: string;
  position: string;
  cardType: string;
  minOvr: number;
  maxOvr: number;
  sort: string;
  order: 'asc' | 'desc';
}

export type ViewTab = 'overview' | 'events' | 'players' | 'store' | 'operations' | 'performance' | 'interview';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
