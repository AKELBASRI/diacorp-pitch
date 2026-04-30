export type StrategyId =
  | 'data-center'
  | 'energy-market'
  | 'carbon-tokens'
  | 'predictive-om'
  | 'industrial-zone'
  | 'green-hydrogen'
  | 'bess-arbitrage'
  | 'corporate-ppa'
  | 'retail-solar'
  | 'gis-permitting';

export type Strategy = {
  id: StrategyId;
  number: string; // '01' - '10'
  revenueY5Musd: number; // revenue year 5 in millions USD
  marginPct: number;
  capexMusd: number;
  phase: 1 | 2 | 3;
  tags: string[];
  tintHsl: string; // accent for section
};

export const STRATEGIES: Strategy[] = [
  {
    id: 'data-center',
    number: '01',
    revenueY5Musd: 1200,
    marginPct: 55,
    capexMusd: 450,
    phase: 2,
    tags: ['GPU-as-a-Service', 'Hyperscale PPA', 'CBAM', 'Sovereign AI'],
    tintHsl: '32 88% 60%'
  },
  {
    id: 'energy-market',
    number: '02',
    revenueY5Musd: 180,
    marginPct: 70,
    capexMusd: 6,
    phase: 1,
    tags: ['Order Book', 'Smart Contracts', 'VPP Aggregation', 'PPA Direct'],
    tintHsl: '168 72% 55%'
  },
  {
    id: 'carbon-tokens',
    number: '03',
    revenueY5Musd: 140,
    marginPct: 78,
    capexMusd: 3,
    phase: 1,
    tags: ['On-chain RECs', 'CBAM compliance', 'Verra/Gold Standard', 'MRV'],
    tintHsl: '144 62% 52%'
  },
  {
    id: 'predictive-om',
    number: '04',
    revenueY5Musd: 85,
    marginPct: 65,
    capexMusd: 4,
    phase: 1,
    tags: ['Digital Twin', 'Computer Vision', 'LSTM Forecasting', 'SaaS Africa'],
    tintHsl: '12 82% 60%'
  },
  {
    id: 'industrial-zone',
    number: '05',
    revenueY5Musd: 95,
    marginPct: 72,
    capexMusd: 2,
    phase: 2,
    tags: ['Tenant ERP', 'Scope 1/2/3', 'Waste Heat Market', 'CSR Dashboard'],
    tintHsl: '48 88% 58%'
  },
  {
    id: 'green-hydrogen',
    number: '06',
    revenueY5Musd: 320,
    marginPct: 40,
    capexMusd: 180,
    phase: 3,
    tags: ['H2 / NH3 Export', 'Electrolyzer Control', 'Ports marocains', 'Optimization'],
    tintHsl: '200 78% 58%'
  },
  {
    id: 'bess-arbitrage',
    number: '07',
    revenueY5Musd: 60,
    marginPct: 58,
    capexMusd: 45,
    phase: 1,
    tags: ['Reinforcement Learning', 'SOC Optimization', 'Peak Shaving', 'Grid Services'],
    tintHsl: '278 68% 68%'
  },
  {
    id: 'corporate-ppa',
    number: '08',
    revenueY5Musd: 70,
    marginPct: 80,
    capexMusd: 2,
    phase: 2,
    tags: ['Industriels Oriental', 'Wheeling Automation', 'LCOE Analyzer', '2% fees'],
    tintHsl: '24 80% 62%'
  },
  {
    id: 'retail-solar',
    number: '09',
    revenueY5Musd: 480,
    marginPct: 35,
    capexMusd: 90,
    phase: 3,
    tags: ['Solar-as-a-Service', 'BMCE Embedded Finance', 'Mobile App', 'B2C Scale'],
    tintHsl: '188 72% 56%'
  },
  {
    id: 'gis-permitting',
    number: '10',
    revenueY5Musd: 45,
    marginPct: 75,
    capexMusd: 1.5,
    phase: 1,
    tags: ['Solar Irradiance GIS', 'Grid Proximity', 'Africa Expansion', 'DFI partners'],
    tintHsl: '96 55% 55%'
  }
];

export const TOTAL_REVENUE_Y5 = STRATEGIES.reduce(
  (sum, s) => sum + s.revenueY5Musd,
  0
);
export const TOTAL_CAPEX = STRATEGIES.reduce((sum, s) => sum + s.capexMusd, 0);
export const WEIGHTED_MARGIN =
  STRATEGIES.reduce((sum, s) => sum + s.revenueY5Musd * s.marginPct, 0) /
  TOTAL_REVENUE_Y5;
