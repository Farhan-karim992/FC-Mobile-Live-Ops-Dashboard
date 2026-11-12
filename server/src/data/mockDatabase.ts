import { LiveEvent, PlayerCard, LiveOpsMetrics, StorePack, BroadcastAlert, AuditLogEntry } from '../types';

// Helper to generate ISO dates relative to now
const now = new Date();
const addHours = (h: number) => new Date(now.getTime() + h * 3600 * 1000).toISOString();
const addDays = (d: number) => new Date(now.getTime() + d * 86400 * 1000).toISOString();
const subDays = (d: number) => new Date(now.getTime() - d * 86400 * 1000).toISOString();

export const INITIAL_EVENTS: LiveEvent[] = [
  {
    id: 'evt-toty-2026',
    title: 'Team of the Year (TOTY) Ultimate Chapter',
    subtitle: 'Claim 97+ OVR TOTY Icons & Ultimate XI Stars',
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    type: 'PROMO',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    startDate: subDays(4),
    endDate: addDays(10),
    resetTimeDailyUtc: '19:00 UTC',
    description: 'Advance through position chapters (Attackers, Midfielders, Defenders). Earn TOTY Energy daily, unlock path milestone rewards, and exchange Nominees for 97 OVR Kylian Mbappé or Jude Bellingham.',
    rewardTier: '97+ OVR Prime TOTY Select',
    featuredPlayerIds: ['ply-mbappe', 'ply-bellingham', 'ply-rodri', 'ply-vvd'],
    participantCount: 2840500,
    progressPercentage: 68,
    tags: ['TOTY', 'Main Event', 'UTOTY', 'Milestone'],
    requirements: {
      minOvr: 90,
      requiredLeague: 'Any',
      energyCostPerMatch: 15,
    },
    liveFormMultiplier: 1.25,
  },
  {
    id: 'evt-ucl-rttf',
    title: 'UEFA Champions League: Road to the Final',
    subtitle: 'Live dynamic OVR upgrades tied to real-world knockout matches',
    bannerUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    type: 'TOURNAMENT',
    status: 'ACTIVE',
    priority: 'HIGH',
    startDate: subDays(1),
    endDate: addDays(18),
    resetTimeDailyUtc: '19:00 UTC',
    description: 'Compete in Champions League PvE and PvP Tournament brackets. Selected players receive +1 OVR boost each time their real-world team advances in the Round of 16 and Quarterfinals.',
    rewardTier: '95-97 OVR UCL Live Upgrade Card',
    featuredPlayerIds: ['ply-haaland', 'ply-vinicius', 'ply-debruyne'],
    participantCount: 1420900,
    progressPercentage: 42,
    tags: ['UCL', 'Live Boost', 'Knockout', 'Tournament'],
    requirements: {
      minOvr: 88,
      energyCostPerMatch: 10,
    },
    liveFormMultiplier: 1.15,
  },
  {
    id: 'evt-flash-weekend-24h',
    title: 'Flash 24H Super Challenge: El Clásico Showdown',
    subtitle: 'Limited-time weekend blitz — expires tonight!',
    bannerUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    type: 'FLASH_SALE',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    startDate: subDays(0.5),
    endDate: addHours(4.5), // Short timer: 4.5 hours!
    resetTimeDailyUtc: '23:59 UTC',
    description: 'High-intensity 5-match gauntlet with sudden death extra time. Win all 5 matches before the countdown expires to secure a guaranteed 94+ OVR Flash Player and 2,500 Gems.',
    rewardTier: '94+ OVR Flash Player & 2,500 Gems',
    featuredPlayerIds: ['ply-vinicius', 'ply-bellingham'],
    participantCount: 890400,
    progressPercentage: 84,
    tags: ['Flash 24H', 'Limited Time', 'Gauntlet', 'Weekend'],
    requirements: {
      minOvr: 92,
      energyCostPerMatch: 20,
    },
    liveFormMultiplier: 1.5,
  },
  {
    id: 'evt-icon-journey-zidane',
    title: 'Icon Journey: Zinedine Zidane Masterclass',
    subtitle: 'Relive iconic career chapters from Bordeaux to Madrid',
    bannerUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
    type: 'MILESTONE',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    startDate: subDays(14),
    endDate: addDays(45),
    resetTimeDailyUtc: '19:00 UTC',
    description: 'Complete 3 phases of historical challenges using French and Serie A/La Liga squads. Unlocks 99 OVR Prime Icon Zidane with custom volleys and Roulette skill moves.',
    rewardTier: '99 OVR Prime Icon Zinedine Zidane',
    featuredPlayerIds: ['ply-zidane'],
    participantCount: 3120000,
    progressPercentage: 55,
    tags: ['Icons', 'Zidane', 'Permanent Journey', 'PVE'],
    requirements: {
      minOvr: 85,
      requiredLeague: 'La Liga / Serie A',
    },
  },
  {
    id: 'evt-rulebreakers-reboot',
    title: 'Rulebreakers: Unorthodox Playing Styles',
    subtitle: 'Defenders with striker finishing, strikers with brick-wall defense',
    bannerUrl: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=1200&q=80',
    type: 'PROMO',
    status: 'PAUSED',
    priority: 'HIGH',
    startDate: subDays(2),
    endDate: addDays(5),
    resetTimeDailyUtc: '19:00 UTC',
    description: 'Live-ops temporary pause due to chemistry rating calculation glitch in V2.4 client. Operations team scheduled to resume after hotfix deployment.',
    rewardTier: '93-95 OVR Rulebreaker Shapeshifter',
    featuredPlayerIds: ['ply-saka', 'ply-vvd'],
    participantCount: 450100,
    progressPercentage: 30,
    tags: ['Rulebreakers', 'Paused', 'Hotfix Pending'],
    requirements: {
      minOvr: 87,
    },
  },
  {
    id: 'evt-division-rivals-season-6',
    title: 'Division Rivals: Global Season 6 Finale',
    subtitle: 'Push for FIFA Champion rank before weekly leaderboard reset',
    bannerUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80',
    type: 'CHALLENGE',
    status: 'ACTIVE',
    priority: 'HIGH',
    startDate: subDays(5),
    endDate: addDays(2),
    resetTimeDailyUtc: '02:00 UTC',
    description: 'Head-to-Head and VS Attack competitive ranked season. Top 250 players globally receive exclusive animated FC Champion crests and 10,000 FC Points.',
    rewardTier: 'Top 250 Animated Crest & 5,000,000 Coins',
    featuredPlayerIds: ['ply-messi', 'ply-cr7'],
    participantCount: 4950000,
    progressPercentage: 91,
    tags: ['H2H', 'VSA', 'Ranked', 'Division Rivals'],
    requirements: {
      minOvr: 90,
    },
  },
  {
    id: 'evt-winter-wildcards-upcoming',
    title: 'Winter Wildcards: Frostbite Festival',
    subtitle: 'Upcoming winter holiday celebration with mystery daily gifts',
    bannerUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
    type: 'PROMO',
    status: 'UPCOMING',
    priority: 'MEDIUM',
    startDate: addDays(3),
    endDate: addDays(24),
    resetTimeDailyUtc: '19:00 UTC',
    description: 'Prepared live-ops campaign ready for holiday launch. Features daily Advent calendar rewards, Frost token exchanges, and 96 OVR Snow Day Master items.',
    rewardTier: '96 OVR Snow Day Master Item',
    featuredPlayerIds: ['ply-saka', 'ply-debruyne'],
    participantCount: 0,
    progressPercentage: 0,
    tags: ['Upcoming', 'Holiday', 'Winter', 'Tokens'],
    requirements: {
      minOvr: 80,
    },
  },
  {
    id: 'evt-heritage-champions-concluded',
    title: 'Heritage Champions: Latin America Classic',
    subtitle: 'Copa Libertadores & Sudamericana showcase (Concluded)',
    bannerUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&q=80',
    type: 'TOURNAMENT',
    status: 'CONCLUDED',
    priority: 'NORMAL',
    startDate: subDays(20),
    endDate: subDays(1),
    resetTimeDailyUtc: '19:00 UTC',
    description: 'Celebration of iconic South American club football legends. Campaign has concluded; reward redemption window is closed.',
    rewardTier: '92-94 OVR Libertadores Icon',
    featuredPlayerIds: ['ply-messi'],
    participantCount: 1890000,
    progressPercentage: 100,
    tags: ['Archived', 'Concluded', 'Heritage'],
    requirements: {
      minOvr: 84,
    },
  },
];

export const INITIAL_PLAYERS: PlayerCard[] = [
  {
    id: 'ply-mbappe',
    name: 'Kylian Mbappé',
    knownAs: 'Mbappé',
    club: 'Real Madrid',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&q=80',
    nation: 'France',
    nationFlagUrl: '🇫🇷',
    league: 'LaLiga EA SPORTS',
    position: 'ST',
    ovr: 97,
    baseOvr: 97,
    cardType: 'TOTY',
    stats: {
      pace: 99,
      shooting: 96,
      passing: 88,
      dribbling: 97,
      defending: 42,
      physical: 84,
    },
    weakFoot: 5,
    skillMoves: 5,
    traits: ['Speed Dribbler', 'Finesse Shot', 'Outside Foot Shot', 'Flair'],
    marketPrice: 145000000,
    priceTrend: [138000000, 140000000, 142000000, 139000000, 143000000, 144500000, 145000000],
    isLiveBoostActive: true,
    boostAmount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    workRate: 'High / Low',
  },
  {
    id: 'ply-bellingham',
    name: 'Jude Bellingham',
    knownAs: 'Bellingham',
    club: 'Real Madrid',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&q=80',
    nation: 'England',
    nationFlagUrl: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    league: 'LaLiga EA SPORTS',
    position: 'CAM',
    ovr: 97,
    baseOvr: 97,
    cardType: 'TOTY',
    stats: {
      pace: 89,
      shooting: 94,
      passing: 93,
      dribbling: 95,
      defending: 86,
      physical: 92,
    },
    weakFoot: 4,
    skillMoves: 4,
    traits: ['Relentless Engine', 'Long Shot Taker', 'Power Header', 'Playmaker'],
    marketPrice: 128000000,
    priceTrend: [119000000, 122000000, 124000000, 126000000, 125000000, 127000000, 128000000],
    isLiveBoostActive: true,
    boostAmount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    workRate: 'High / High',
  },
  {
    id: 'ply-haaland',
    name: 'Erling Haaland',
    knownAs: 'Haaland',
    club: 'Manchester City',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&q=80',
    nation: 'Norway',
    nationFlagUrl: '🇳🇴',
    league: 'Premier League',
    position: 'ST',
    ovr: 96,
    baseOvr: 96,
    cardType: 'UCL_RTTF',
    stats: {
      pace: 95,
      shooting: 98,
      passing: 78,
      dribbling: 87,
      defending: 50,
      physical: 96,
    },
    weakFoot: 4,
    skillMoves: 4,
    traits: ['Acrobatic Finisher', 'Power Header', 'Target Forward', 'Bull Rush'],
    marketPrice: 115000000,
    priceTrend: [102000000, 106000000, 109000000, 111000000, 113000000, 114000000, 115000000],
    isLiveBoostActive: false,
    boostAmount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    workRate: 'High / Medium',
  },
  {
    id: 'ply-vinicius',
    name: 'Vinícius Júnior',
    knownAs: 'Vini Jr.',
    club: 'Real Madrid',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&q=80',
    nation: 'Brazil',
    nationFlagUrl: '🇧🇷',
    league: 'LaLiga EA SPORTS',
    position: 'LW',
    ovr: 95,
    baseOvr: 95,
    cardType: 'RULEBREAKER',
    stats: {
      pace: 99,
      shooting: 92,
      passing: 87,
      dribbling: 98,
      defending: 39,
      physical: 76,
    },
    weakFoot: 5,
    skillMoves: 5,
    traits: ['Speed Dribbler', 'Trickster', 'Chip Shot', 'Flair'],
    marketPrice: 89000000,
    priceTrend: [82000000, 84000000, 85500000, 87000000, 86000000, 88000000, 89000000],
    isLiveBoostActive: false,
    boostAmount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    workRate: 'High / Medium',
  },
  {
    id: 'ply-zidane',
    name: 'Zinedine Zidane',
    knownAs: 'Zidane',
    club: 'Icons',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&q=80',
    nation: 'France',
    nationFlagUrl: '🇫🇷',
    league: 'Icon League',
    position: 'CAM',
    ovr: 99,
    baseOvr: 99,
    cardType: 'PRIME_ICON',
    stats: {
      pace: 90,
      shooting: 96,
      passing: 99,
      dribbling: 98,
      defending: 82,
      physical: 91,
    },
    weakFoot: 5,
    skillMoves: 5,
    traits: ['Roulette Maestro', 'Precision Passer', 'Long Shot Specialist', 'Iconic Volley'],
    marketPrice: 320000000,
    priceTrend: [310000000, 315000000, 318000000, 320000000, 322000000, 319000000, 320000000],
    isLiveBoostActive: true,
    boostAmount: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    workRate: 'High / Medium',
  },
  {
    id: 'ply-messi',
    name: 'Lionel Messi',
    knownAs: 'Messi',
    club: 'Inter Miami CF',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=100&q=80',
    nation: 'Argentina',
    nationFlagUrl: '🇦🇷',
    league: 'MLS',
    position: 'RW',
    ovr: 98,
    baseOvr: 98,
    cardType: 'PRIME_ICON',
    stats: {
      pace: 94,
      shooting: 98,
      passing: 99,
      dribbling: 99,
      defending: 40,
      physical: 75,
    },
    weakFoot: 5,
    skillMoves: 5,
    traits: ['Finesse Master', 'Dribbling Genius', 'Playmaker', 'Set Piece Master'],
    marketPrice: 280000000,
    priceTrend: [270000000, 275000000, 278000000, 282000000, 280000000, 279000000, 280000000],
    isLiveBoostActive: false,
    boostAmount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    workRate: 'Medium / Low',
  },
  {
    id: 'ply-cr7',
    name: 'Cristiano Ronaldo',
    knownAs: 'Ronaldo',
    club: 'Al Nassr',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&q=80',
    nation: 'Portugal',
    nationFlagUrl: '🇵🇹',
    league: 'ROSHN Saudi League',
    position: 'ST',
    ovr: 98,
    baseOvr: 98,
    cardType: 'PRIME_ICON',
    stats: {
      pace: 94,
      shooting: 99,
      passing: 86,
      dribbling: 93,
      defending: 45,
      physical: 95,
    },
    weakFoot: 5,
    skillMoves: 5,
    traits: ['Power Header', 'Knuckleball', 'Outside Foot', 'Aerial Threat'],
    marketPrice: 295000000,
    priceTrend: [285000000, 288000000, 292000000, 290000000, 294000000, 296000000, 295000000],
    isLiveBoostActive: false,
    boostAmount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    workRate: 'High / Low',
  },
  {
    id: 'ply-vvd',
    name: 'Virgil van Dijk',
    knownAs: 'Van Dijk',
    club: 'Liverpool',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=100&q=80',
    nation: 'Netherlands',
    nationFlagUrl: '🇳🇱',
    league: 'Premier League',
    position: 'CB',
    ovr: 96,
    baseOvr: 96,
    cardType: 'HERO',
    stats: {
      pace: 88,
      shooting: 65,
      passing: 84,
      dribbling: 82,
      defending: 98,
      physical: 97,
    },
    weakFoot: 4,
    skillMoves: 3,
    traits: ['Aerial Fortress', 'Dive into Tackles', 'Leader', 'Long Passer'],
    marketPrice: 110000000,
    priceTrend: [104000000, 107000000, 108000000, 109000000, 110000000, 111000000, 110000000],
    isLiveBoostActive: true,
    boostAmount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    workRate: 'Medium / High',
  },
  {
    id: 'ply-rodri',
    name: 'Rodrigo Hernández',
    knownAs: 'Rodri',
    club: 'Manchester City',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&q=80',
    nation: 'Spain',
    nationFlagUrl: '🇪🇸',
    league: 'Premier League',
    position: 'CDM',
    ovr: 96,
    baseOvr: 96,
    cardType: 'TOTY',
    stats: {
      pace: 82,
      shooting: 89,
      passing: 95,
      dribbling: 90,
      defending: 96,
      physical: 94,
    },
    weakFoot: 4,
    skillMoves: 3,
    traits: ['Holding Midfield Anchor', 'Long Passer', 'Power Shot', 'Intercept+'],
    marketPrice: 95000000,
    priceTrend: [88000000, 90000000, 92000000, 94000000, 94500000, 95000000, 95000000],
    isLiveBoostActive: false,
    boostAmount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    workRate: 'Medium / High',
  },
  {
    id: 'ply-debruyne',
    name: 'Kevin De Bruyne',
    knownAs: 'De Bruyne',
    club: 'Manchester City',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&q=80',
    nation: 'Belgium',
    nationFlagUrl: '🇧🇪',
    league: 'Premier League',
    position: 'CM',
    ovr: 96,
    baseOvr: 96,
    cardType: 'TOTS',
    stats: {
      pace: 84,
      shooting: 95,
      passing: 99,
      dribbling: 92,
      defending: 78,
      physical: 86,
    },
    weakFoot: 5,
    skillMoves: 4,
    traits: ['Incivisive Through Ball', 'Whipped Crosser', 'Long Shot Specialist'],
    marketPrice: 105000000,
    priceTrend: [98000000, 101000000, 102500000, 104000000, 103000000, 105000000, 105000000],
    isLiveBoostActive: false,
    boostAmount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    workRate: 'High / High',
  },
  {
    id: 'ply-saka',
    name: 'Bukayo Saka',
    knownAs: 'Saka',
    club: 'Arsenal',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&q=80',
    nation: 'England',
    nationFlagUrl: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    league: 'Premier League',
    position: 'RW',
    ovr: 94,
    baseOvr: 94,
    cardType: 'RULEBREAKER',
    stats: {
      pace: 96,
      shooting: 91,
      passing: 90,
      dribbling: 95,
      defending: 68,
      physical: 82,
    },
    weakFoot: 4,
    skillMoves: 4,
    traits: ['Cutting Inside', 'Speedster', 'Finesse Shot'],
    marketPrice: 72000000,
    priceTrend: [68000000, 69000000, 71000000, 70500000, 71500000, 72000000, 72000000],
    isLiveBoostActive: true,
    boostAmount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    workRate: 'High / Medium',
  },
  {
    id: 'ply-alisson',
    name: 'Alisson Becker',
    knownAs: 'Alisson',
    club: 'Liverpool',
    clubBadgeUrl: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=100&q=80',
    nation: 'Brazil',
    nationFlagUrl: '🇧🇷',
    league: 'Premier League',
    position: 'GK',
    ovr: 95,
    baseOvr: 95,
    cardType: 'TOTY',
    stats: {
      pace: 88, // GK Diving
      shooting: 90, // GK Handling
      passing: 93, // GK Kicking
      dribbling: 94, // GK Reflexes
      defending: 62, // Speed
      physical: 92, // GK Positioning
    },
    weakFoot: 3,
    skillMoves: 1,
    traits: ['Sweeper Keeper', '1-on-1 Specialist', 'Rushes Out of Goal'],
    marketPrice: 65000000,
    priceTrend: [61000000, 62500000, 63000000, 64000000, 64500000, 65000000, 65000000],
    isLiveBoostActive: false,
    boostAmount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    workRate: 'Medium / Medium',
  },
];

export const INITIAL_PACKS: StorePack[] = [
  {
    id: 'pack-toty-ultimate',
    name: 'TOTY Ultimate 95+ Guarantee Pack',
    category: 'FEATURED',
    costType: 'FC_POINTS',
    cost: 5000,
    guaranteedMinOvr: 95,
    expiryDate: addDays(6),
    bannerColor: 'linear-gradient(135deg, #00ff87 0%, #60efff 50%, #0061ff 100%)',
    description: 'Guarantees 1x 95+ OVR Team of the Year Player, plus 4x 88+ OVR tradeable items and 1,000,000 Coins.',
    availableCount: 3,
    featuredPlayers: ['Mbappé', 'Bellingham', 'Rodri'],
    dropRates: [
      { range: '97+ OVR Prime TOTY', chancePercentage: 3.5 },
      { range: '95-96 OVR TOTY Item', chancePercentage: 96.5 },
    ],
  },
  {
    id: 'pack-flash-lightning',
    name: 'Flash Lightning Round Bundle',
    category: 'FLASH',
    costType: 'GEMS',
    cost: 7500,
    guaranteedMinOvr: 92,
    expiryDate: addHours(3.5),
    bannerColor: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    description: 'Special 4-hour flash sale with doubled 96+ drop chances! Limit 2 per live-ops cycle.',
    availableCount: 2,
    featuredPlayers: ['Vinícius Jr.', 'Haaland'],
    dropRates: [
      { range: '96+ OVR UCL / TOTY', chancePercentage: 8.2 },
      { range: '94-95 OVR Star', chancePercentage: 32.8 },
      { range: '92-93 OVR Elite', chancePercentage: 59.0 },
    ],
  },
  {
    id: 'pack-icon-heritage',
    name: 'Prime Icon Class of Legends Pack',
    category: 'MILESTONE',
    costType: 'FC_POINTS',
    cost: 10000,
    guaranteedMinOvr: 97,
    expiryDate: addDays(21),
    bannerColor: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    description: 'Highest tier legacy pack featuring 98-99 OVR Icons: Zidane, Messi, Ronaldo, and Pelé.',
    availableCount: 1,
    featuredPlayers: ['Zidane', 'Messi', 'Ronaldo'],
    dropRates: [
      { range: '99 OVR Prime Icon', chancePercentage: 5.0 },
      { range: '98 OVR Icon Star', chancePercentage: 25.0 },
      { range: '97 OVR Icon Master', chancePercentage: 70.0 },
    ],
  },
  {
    id: 'pack-division-champion',
    name: 'Division Rivals Weekly Champion Chest',
    category: 'DIVISION',
    costType: 'COINS',
    cost: 15000000,
    guaranteedMinOvr: 90,
    expiryDate: addDays(2),
    bannerColor: 'linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)',
    description: 'Earned or purchasable through weekly PvP division milestones. Contains 10 items + rank tokens.',
    availableCount: 5,
    featuredPlayers: ['Van Dijk', 'Saka', 'Alisson'],
    dropRates: [
      { range: '95+ OVR Top Tier', chancePercentage: 4.0 },
      { range: '92-94 OVR Mid Tier', chancePercentage: 28.0 },
      { range: '90-91 OVR Base Tier', chancePercentage: 68.0 },
    ],
  },
];

export const INITIAL_BROADCASTS: BroadcastAlert[] = [
  {
    id: 'bc-1',
    title: 'Flash Lightning Rounds are LIVE!',
    message: 'Double 96+ OVR drop rates active in Store for the next 4 hours! Claim before daily reset.',
    type: 'PROMO',
    isActive: true,
    targetClientVersion: 'All',
    createdAt: subDays(0.1),
    expiresAt: addHours(4),
  },
  {
    id: 'bc-2',
    title: 'Scheduled Matchmaking Maintenance at 02:00 UTC',
    message: 'H2H and VS Attack queues will pause for 30 minutes for server infrastructure scale-up.',
    type: 'MAINTENANCE',
    isActive: true,
    targetClientVersion: '>=2.4.0',
    createdAt: subDays(0.2),
    expiresAt: addHours(12),
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
    operator: 'alex.ops@eafc.live',
    action: 'DISPATCH_BROADCAST',
    category: 'BROADCAST',
    details: 'Dispatched in-game banner alert: Flash Lightning Rounds live (4h window).',
  },
  {
    id: 'log-2',
    timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
    operator: 'sarah.liveops@eafc.live',
    action: 'BOOST_TOGGLE',
    category: 'EVENT',
    details: 'Applied +2 Form Boost to Kylian Mbappé & Jude Bellingham for TOTY Chapter 2.',
  },
  {
    id: 'log-3',
    timestamp: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
    operator: 'marcus.lead@eafc.live',
    action: 'EVENT_PAUSE',
    category: 'EVENT',
    details: 'Paused "Rulebreakers: Unorthodox Playing Styles" pending V2.4 client hotfix.',
  },
  {
    id: 'log-4',
    timestamp: new Date(now.getTime() - 6 * 3600 * 1000).toISOString(),
    operator: 'sarah.liveops@eafc.live',
    action: 'STORE_UPDATE',
    category: 'STORE',
    details: 'Refreshed weekly store inventory quotas; loaded TOTY Ultimate 95+ Guarantee packs.',
  },
];

// In-Memory Database Storage
class MockDatabase {
  private events: LiveEvent[] = JSON.parse(JSON.stringify(INITIAL_EVENTS));
  private players: PlayerCard[] = JSON.parse(JSON.stringify(INITIAL_PLAYERS));
  private packs: StorePack[] = JSON.parse(JSON.stringify(INITIAL_PACKS));
  private broadcasts: BroadcastAlert[] = JSON.parse(JSON.stringify(INITIAL_BROADCASTS));
  private auditLogs: AuditLogEntry[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));

  // Events
  getEvents() {
    return this.events;
  }

  getEventById(id: string) {
    return this.events.find(e => e.id === id);
  }

  createEvent(eventData: Omit<LiveEvent, 'id' | 'participantCount' | 'progressPercentage'>): LiveEvent {
    const newEvent: LiveEvent = {
      ...eventData,
      id: `evt-${Date.now().toString(36)}`,
      participantCount: 0,
      progressPercentage: 0,
    };
    this.events.unshift(newEvent);
    this.addAuditLog('OPERATOR', 'EVENT_CREATE', 'EVENT', `Created new live-ops event "${newEvent.title}"`);
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<LiveEvent>): LiveEvent | null {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.events[index] = { ...this.events[index], ...updates };
    this.addAuditLog('OPERATOR', 'EVENT_UPDATE', 'EVENT', `Updated event "${this.events[index].title}": ${Object.keys(updates).join(', ')}`);
    return this.events[index];
  }

  deleteEvent(id: string): boolean {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return false;
    const title = this.events[index].title;
    this.events.splice(index, 1);
    this.addAuditLog('OPERATOR', 'EVENT_DELETE', 'EVENT', `Deleted live-ops event "${title}"`);
    return true;
  }

  // Players
  getPlayers() {
    return this.players;
  }

  getPlayerById(id: string) {
    return this.players.find(p => p.id === id);
  }

  togglePlayerBoost(id: string): PlayerCard | null {
    const player = this.players.find(p => p.id === id);
    if (!player) return null;
    player.isLiveBoostActive = !player.isLiveBoostActive;
    player.boostAmount = player.isLiveBoostActive ? 2 : 0;
    player.ovr = player.baseOvr + player.boostAmount;
    this.addAuditLog(
      'OPERATOR',
      'PLAYER_BOOST_TOGGLE',
      'EVENT',
      `${player.isLiveBoostActive ? 'Applied' : 'Removed'} live form boost for ${player.knownAs} (Now ${player.ovr} OVR)`
    );
    return player;
  }

  // Packs
  getPacks() {
    return this.packs;
  }

  simulatePackPull(packId: string): { player: PlayerCard; rarityTier: string; isWalkout: boolean } {
    const pack = this.packs.find(p => p.id === packId) || this.packs[0];
    
    // Weighted random selection based on drop rates
    const roll = Math.random() * 100;
    let accumulated = 0;
    let selectedTier = pack.dropRates[pack.dropRates.length - 1].range;

    for (const tier of pack.dropRates) {
      accumulated += tier.chancePercentage;
      if (roll <= accumulated) {
        selectedTier = tier.range;
        break;
      }
    }

    // Filter candidate players by pack guaranteed min OVR or tier
    const eligible = this.players.filter(p => p.ovr >= pack.guaranteedMinOvr);
    const pool = eligible.length > 0 ? eligible : this.players;
    const selectedPlayer = pool[Math.floor(Math.random() * pool.length)];
    const isWalkout = selectedPlayer.ovr >= 95;

    this.addAuditLog(
      'SIMULATOR',
      'PACK_PULL',
      'STORE',
      `Simulated drop for "${pack.name}": Pulled ${selectedPlayer.knownAs} (${selectedPlayer.ovr} OVR) - Tier: ${selectedTier}`
    );

    return {
      player: selectedPlayer,
      rarityTier: selectedTier,
      isWalkout,
    };
  }

  // Broadcasts
  getBroadcasts() {
    return this.broadcasts;
  }

  createBroadcast(data: Omit<BroadcastAlert, 'id' | 'createdAt'>): BroadcastAlert {
    const newBc: BroadcastAlert = {
      ...data,
      id: `bc-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    this.broadcasts.unshift(newBc);
    this.addAuditLog('OPERATOR', 'DISPATCH_BROADCAST', 'BROADCAST', `Dispatched broadcast alert: "${newBc.title}"`);
    return newBc;
  }

  deleteBroadcast(id: string): boolean {
    const index = this.broadcasts.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.broadcasts.splice(index, 1);
    this.addAuditLog('OPERATOR', 'DISMISS_BROADCAST', 'BROADCAST', `Dismissed broadcast id ${id}`);
    return true;
  }

  // Metrics
  getMetrics(): LiveOpsMetrics {
    // Dynamic slight variations for realism
    const randomJitter = Math.floor(Math.random() * 1500) - 750;
    const ccu = 184520 + randomJitter;

    return {
      ccuCurrent: ccu,
      ccuPeakToday: 245890,
      activeEventsCount: this.events.filter(e => e.status === 'ACTIVE').length,
      activeBannersCount: this.broadcasts.filter(b => b.isActive).length,
      globalDropRateBonus: 1.25,
      serverHealth: [
        { region: 'North America (US-East)', cluster: 'iad-01', pingMs: 18, status: 'OPTIMAL', loadPercentage: 64 },
        { region: 'Europe West (Frankfurt)', cluster: 'fra-02', pingMs: 24, status: 'OPTIMAL', loadPercentage: 78 },
        { region: 'Asia Pacific (Tokyo)', cluster: 'nrt-01', pingMs: 42, status: 'OPTIMAL', loadPercentage: 71 },
        { region: 'South America (São Paulo)', cluster: 'gru-01', pingMs: 38, status: 'OPTIMAL', loadPercentage: 55 },
        { region: 'Middle East (Dubai)', cluster: 'dxb-01', pingMs: 29, status: 'OPTIMAL', loadPercentage: 60 },
      ],
      errorRatePercentage: 0.04,
      timestamp: new Date().toISOString(),
    };
  }

  // Audit Logs
  getAuditLogs() {
    return this.auditLogs;
  }

  addAuditLog(operator: string, action: string, category: 'EVENT' | 'STORE' | 'BROADCAST' | 'HOTFIX', details: string) {
    const entry: AuditLogEntry = {
      id: `log-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      operator,
      action,
      category,
      details,
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 50) this.auditLogs.pop();
  }

  resetAll() {
    this.events = JSON.parse(JSON.stringify(INITIAL_EVENTS));
    this.players = JSON.parse(JSON.stringify(INITIAL_PLAYERS));
    this.packs = JSON.parse(JSON.stringify(INITIAL_PACKS));
    this.broadcasts = JSON.parse(JSON.stringify(INITIAL_BROADCASTS));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.addAuditLog('SYSTEM', 'RESET_DATA', 'HOTFIX', 'Reset all live-ops database tables to initial defaults.');
  }
}

export const db = new MockDatabase();

