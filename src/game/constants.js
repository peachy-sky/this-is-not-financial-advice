export const COIN_VALUE = 1000;
export const STARTING_AGE = 25;
export const TOTAL_TURNS = 10;
export const STARTING_CREDIT = 600;
export const STARTING_INCOME = 55000;
export const HAND_SIZE = 5;

export const COLORS = {
  sand: 0xe8d8c0,
  rose: 0xd4a5a0,
  sage: 0xa8b89a,
  cream: 0xf5f0e8,
  terracotta: 0xc4714a,
  lilac: 0xb8a8c8,
  gold: 0xd4a843,
  ink: 0x4a3f35,
  paper: 0xfaf6ef,
  green: 0x7ab87a,
  red: 0xc45050,
  white: 0xffffff,
};

export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  HYSA: 'hysa',
  CD: 'cd',
  CREDIT_CARD: 'credit_card',
  ROTH_IRA: 'roth_ira',
  TRAD_IRA: 'trad_ira',
  BROKERAGE: 'brokerage',
};

export const ACCOUNT_CONFIG = {
  checking: {
    label: 'Checking',
    emoji: '🪴',
    interestMin: 0,
    interestMax: 0,
    color: 0xf5f0e8,
    description: 'No interest. Your day-to-day account.',
  },
  savings: {
    label: 'Savings',
    emoji: '🐷',
    interestMin: 0.001,
    interestMax: 0.005,
    color: 0xd4e8d0,
    description: 'Earns 0.1–0.5% APY. FDIC insured.',
  },
  hysa: {
    label: 'High-Yield Savings',
    emoji: '🍯',
    interestMin: 0.02,
    interestMax: 0.05,
    color: 0xb8d4a8,
    description: 'Earns 2–5% APY. Fluctuates each year.',
  },
  cd: {
    label: 'CD',
    emoji: '🫙',
    interestMin: 0.03,
    interestMax: 0.07,
    color: 0xd4c4a8,
    description: 'Locked for 1–5 years. Higher term = higher rate.',
    terms: [
      { years: 1, rate: 0.03 },
      { years: 2, rate: 0.04 },
      { years: 3, rate: 0.05 },
      { years: 4, rate: 0.06 },
      { years: 5, rate: 0.07 },
    ],
  },
  credit_card: {
    label: 'Credit Card',
    emoji: '🍃',
    creditLimit: 10000,
    apr: 0.20,
    cashbackRate: 0.015,
    color: 0xf0d4d0,
    description: 'Pay off each year or face interest + credit score penalty.',
  },
  roth_ira: {
    label: 'Roth IRA',
    emoji: '🌻',
    contributionLimit: 7000,
    color: 0xf0e8b0,
    description: 'After-tax. Tax-free growth and withdrawals.',
  },
  trad_ira: {
    label: 'Trad IRA',
    emoji: '🌾',
    contributionLimit: 7000,
    color: 0xe0d8a8,
    description: 'Pre-tax. Deduct from income; taxed on withdrawal.',
  },
  brokerage: {
    label: 'Brokerage',
    emoji: '🌳',
    color: 0xc8e0c0,
    description: 'No limits. Capital gains tax on profits.',
  },
  auto_loan: {
    label: 'Auto Loan Refi',
    emoji: '🚗',
    interestMin: 0.03,
    interestMax: 0.08,
    color: 0xd4c8b8,
    description: 'Refinanced auto loan. Lower APR = lower monthly cost.',
  },
  home_loan: {
    label: 'Home Loan Refi',
    emoji: '🏡',
    interestMin: 0.025,
    interestMax: 0.10,
    color: 0xc8d4b8,
    description: 'Refinanced mortgage. APR locked for the term.',
  },
};

export const MARKETS = {
  index: {
    id: 'index',
    label: 'Meadow 500',
    emoji: '🌄',
    description: 'Low-risk index fund. Steady, reliable growth.',
    meanReturn: 0.085,
    volatility: 0.03,
    color: 0xa8c8a8,
  },
  growth: {
    id: 'growth',
    label: 'Growth Fund',
    emoji: '🌱',
    description: 'Medium risk. Tech & growth stocks.',
    meanReturn: 0.12,
    volatility: 0.10,
    color: 0xa8b8d4,
  },
  speculative: {
    id: 'speculative',
    label: 'Wild Mushroom Fund',
    emoji: '🍄',
    description: 'High risk. Big gains or big losses.',
    meanReturn: 0.12,
    volatility: 0.28,
    color: 0xd4a8c4,
  },
};

export const EXPENSE_CATEGORIES = [
  { id: 'housing',        label: 'Housing',        default: 15600, min: 9600,  fixed: false },
  { id: 'groceries',      label: 'Groceries',       default: 3600,  min: 1200,  linked: 'dining' },
  { id: 'dining',         label: 'Dining Out',      default: 1800,  min: 0,     linked: 'groceries' },
  { id: 'transportation', label: 'Transportation',  default: 3000,  min: 600,   riskOnDecrease: 'car_repair' },
  { id: 'insurance',      label: 'Insurance',       default: 2400,  min: 600,   riskOnDecrease: 'medical_bill' },
  { id: 'utilities',      label: 'Utilities',       default: 1800,  min: 1200,  fixed: true },
  { id: 'entertainment',  label: 'Entertainment',   default: 1200,  min: 0,     free: true },
  { id: 'misc',           label: 'Miscellaneous',   default: 1200,  min: 0,     free: true },
];

export const TAX_BRACKETS_2026 = [
  { upTo: 11925,  rate: 0.10 },
  { upTo: 48475,  rate: 0.12 },
  { upTo: 103350, rate: 0.22 },
  { upTo: 197300, rate: 0.24 },
  { upTo: Infinity, rate: 0.32 },
];

export const LONG_TERM_CG_BRACKETS = [
  { upTo: 47025,  rate: 0.00 },
  { upTo: 518900, rate: 0.15 },
  { upTo: Infinity, rate: 0.20 },
];

export const CREDIT_SCORE_TIERS = [
  { min: 800, label: 'Exceptional', color: '#7ab87a' },
  { min: 740, label: 'Very Good',   color: '#a8c87a' },
  { min: 670, label: 'Good',        color: '#c8c87a' },
  { min: 580, label: 'Fair',        color: '#d4a843' },
  { min: 0,   label: 'Poor',        color: '#c45050' },
];

export const STAR_THRESHOLDS = { one: 50000, two: 60000, three: 80000 };
