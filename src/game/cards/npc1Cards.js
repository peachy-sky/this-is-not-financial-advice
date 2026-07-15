// npc1Cards.js — Level 1 card pool
//
// CARD TYPES:
//   'account'         → drag onto the board to open a permanent account
//   'event_optional'  → click to play whenever you like; no deadline
//   'event_required'  → MUST be played before clicking "Next Year"
//
// CARD IMAGES:
//   Save each card's PNG to public/ as `npc1-<id>.png`
//   Then add to GameScene.preload():  this.load.image('npc1-<id>', '/npc1-<id>.png');
//   The image key goes in the card's `image` field below.
//
// EFFECT TYPES (used in the `effect` field):
//   { type: 'cash',             amount: N }          → spawn N coins
//   { type: 'income',           amount: N }          → alias for cash
//   { type: 'expense',          amount: N }          → deduct N from checking
//   { type: 'expense_immediate',amount: N }          → alias for expense
//   { type: 'income_increase',  amount: N }          → raise annual income by N
//   { type: 'expense_set',      category, amount }   → override one expense category
//   { type: 'expense_increase', category, amount }   → increase one expense category
//   { type: 'credit_score',     delta: N }           → change credit score
//   { type: 'multi',            effects: [...] }     → apply several effects at once
//   { type: 'choice',           options: [...] }     → show a choice modal
//   { type: 'noop' }                                 → does nothing

// ── ACCOUNT CARDS ────────────────────────────────────────────────────────────
// Drag these onto the board to open the account.
// `accountType` must match a key in ACCOUNT_CONFIG (constants.js).
// `stats` is a list of strings shown on the card face.

export const NPC1_ACCOUNT_CARDS = [
  {
    id: 'npc1_checking',
    name: 'Checking Account',
    type: 'account',
    image: 'npc1-checking',
    accountType: 'checking',
    emoji: '🪴',
    description: 'Your everyday spending account. No interest.',
    stats: ['No interest earned', 'No deposit limit'],
    effects: [],
    happinessEffect: 1,
    flavor: 'Where every paycheck lands.',
  },
  {
    id: 'npc1_savings',
    name: 'Savings Account',
    type: 'account',
    image: 'npc1-savings',
    accountType: 'savings',
    emoji: '🐷',
    description: 'A safe place to stash extra cash.',
    stats: ['Earns 0.1–0.5% APY', 'FDIC insured'],
    effects: [],
    happinessEffect: 1,
    flavor: 'Small steps toward big goals.',
  },
  {
    id: 'npc1_hysa',
    name: 'High-Yield Savings',
    type: 'account',
    image: 'npc1-hysa',
    accountType: 'hysa',
    emoji: '🍯',
    description: 'Earns 2–5% APY. Rates fluctuate each year.',
    stats: ['Earns 2–5% APY', 'FDIC insured'],
    effects: [],
    happinessEffect: 2,
    flavor: 'Your money, but working harder.',
  },
  {
    id: 'npc1_roth_ira',
    name: 'Roth IRA',
    type: 'account',
    image: 'npc1-roth-ira',
    accountType: 'roth_ira',
    emoji: '🌻',
    description: 'After-tax retirement savings. Tax-free growth.',
    stats: ['$7,000/yr contribution limit', 'Tax-free at retirement'],
    effects: [],
    happinessEffect: 2,
    flavor: 'Future you will be so grateful.',
  },
  {
    id: 'npc1_brokerage',
    name: 'Brokerage Account',
    type: 'account',
    image: 'npc1-brokerage',
    accountType: 'brokerage',
    emoji: '🌳',
    description: 'Invest in the market. No contribution limits.',
    stats: ['No limits', 'Capital gains tax on profits'],
    effects: [],
    happinessEffect: 1,
    flavor: 'Plant a seed, watch it grow.',
  },
];

// ── OPTIONAL EVENT CARDS ─────────────────────────────────────────────────────
// Click to play. No deadline — you can hold these across turn end.
// (Hold Optional cards by not playing them; they stay in your hand next turn.)

export const NPC1_OPTIONAL_EVENT_CARDS = [
  {
    id: 'npc1_tax_refund',
    name: 'Tax Refund',
    type: 'event_optional',
    subtype: 'positive',
    image: 'npc1-tax-refund',
    emoji: '💸',
    description: 'The government owes you one.',
    effect: { type: 'cash', amount: 3000 },
    happinessEffect: 2,
    flavor: 'Treat yourself — responsibly.',
  },
  {
    id: 'npc1_side_gig',
    name: 'Side Gig',
    type: 'event_optional',
    subtype: 'positive',
    image: 'npc1-side-gig',
    emoji: '🎨',
    description: 'You picked up a freelance project.',
    effect: { type: 'cash', amount: 2000 },
    happinessEffect: 1,
    flavor: 'Skills pay the bills.',
  },
  {
    id: 'npc1_work_bonus',
    name: 'Work Bonus',
    type: 'event_optional',
    subtype: 'positive',
    image: 'npc1-work-bonus',
    emoji: '🏆',
    description: 'You crushed your performance review.',
    effect: { type: 'cash', amount: 5000 },
    happinessEffect: 3,
    flavor: 'Your manager actually noticed.',
  },
  {
    id: 'npc1_raise',
    name: 'Raise at Work',
    type: 'event_optional',
    subtype: 'positive',
    image: 'npc1-raise',
    emoji: '📈',
    description: 'Your income goes up permanently.',
    effect: { type: 'income_increase', amount: 5000 },
    happinessEffect: 3,
    flavor: 'Compound this.',
  },
  {
    id: 'npc1_cash_gift',
    name: 'Cash Gift',
    type: 'event_optional',
    subtype: 'positive',
    image: 'npc1-cash-gift',
    emoji: '🎁',
    description: 'Someone gave you money for your birthday.',
    effect: { type: 'cash', amount: 1000 },
    happinessEffect: 2,
    flavor: 'Best present ever.',
  },
  {
    id: 'npc1_car_repair',
    name: 'Car Repair',
    type: 'event_optional',
    subtype: 'negative',
    image: 'npc1-car-repair',
    emoji: '🔧',
    description: 'Your car needs work. You can pay or defer.',
    effect: { type: 'expense', amount: 2500 },
    happinessEffect: -1,
    flavor: 'The check engine light was right.',
  },
  {
    id: 'npc1_vacation',
    name: 'Vacation',
    type: 'event_optional',
    subtype: 'special',
    image: 'npc1-vacation',
    emoji: '✈️',
    description: 'Take a trip — worth every penny.',
    effect: { type: 'expense', amount: 3000 },
    happinessEffect: 4,
    flavor: 'Memories > savings (sometimes).',
  },
  {
    id: 'npc1_invest_choice',
    name: 'Windfall',
    type: 'event_optional',
    subtype: 'special',
    image: 'npc1-windfall',
    emoji: '🍀',
    description: 'Unexpected money. How do you use it?',
    effect: {
      type: 'choice',
      options: [
        { label: 'Save it all',  description: 'Deposit $4,000',             type: 'cash', amount: 4000, happinessEffect: 1 },
        { label: 'Treat yourself', description: 'Keep $1k, deposit $3k',   type: 'multi', effects: [{ type: 'cash', amount: 3000 }], happinessEffect: 3 },
        { label: 'Donate it',   description: 'Give $4,000 away',           type: 'noop', happinessEffect: 5 },
      ],
    },
    happinessEffect: 0,
    flavor: 'Lucky you.',
  },
];

// ── REQUIRED EVENT CARDS ─────────────────────────────────────────────────────
// These MUST be played before clicking "Next Year".
// A red indicator appears on the card. The turn button is locked until resolved.

export const NPC1_REQUIRED_EVENT_CARDS = [
  {
    id: 'npc1_rent',
    name: 'Rent',
    type: 'event_required',
    subtype: 'negative',
    image: 'npc1-rent',
    emoji: '🏠',
    description: 'Monthly rent for the year. Must be paid.',
    effect: { type: 'expense', amount: 12000 },
    happinessEffect: 0,
    flavor: 'First of the month, every month.',
    required: true,
  },
  {
    id: 'npc1_groceries',
    name: 'Groceries',
    type: 'event_required',
    subtype: 'negative',
    image: 'npc1-groceries',
    emoji: '🛒',
    description: 'Annual grocery budget. Gotta eat.',
    effect: { type: 'expense', amount: 4800 },
    happinessEffect: 0,
    flavor: 'You tried cooking at home. Mostly.',
    required: true,
  },
  {
    id: 'npc1_utilities',
    name: 'Utility Bills',
    type: 'event_required',
    subtype: 'negative',
    image: 'npc1-utilities',
    emoji: '💡',
    description: 'Electric, water, internet. Unavoidable.',
    effect: { type: 'expense', amount: 2400 },
    happinessEffect: 0,
    flavor: 'At least the Wi-Fi never goes out.',
    required: true,
  },
  {
    id: 'npc1_insurance',
    name: 'Insurance',
    type: 'event_required',
    subtype: 'negative',
    image: 'npc1-insurance',
    emoji: '🛡️',
    description: 'Health & car insurance for the year.',
    effect: { type: 'expense', amount: 3600 },
    happinessEffect: 1,
    flavor: 'Hope you never need it. Pay anyway.',
    required: true,
  },
];

// ── DECK BUILDER ─────────────────────────────────────────────────────────────

export function buildNPC1Deck() {
  const all = [
    ...NPC1_ACCOUNT_CARDS,
    ...NPC1_OPTIONAL_EVENT_CARDS,
    ...NPC1_REQUIRED_EVENT_CARDS,
  ];
  return all.slice().sort(() => Math.random() - 0.5);
}
