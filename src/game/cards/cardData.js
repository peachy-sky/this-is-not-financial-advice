export const ACCOUNT_CARDS = [
  {
    id: 'acc_savings',
    type: 'account',
    accountType: 'savings',
    name: 'Savings Account',
    emoji: '🐷',
    flavor: 'A cozy piggy bank for a rainy day.',
    persistent: true,
  },
  {
    id: 'acc_hysa',
    type: 'account',
    accountType: 'hysa',
    name: 'High-Yield Savings',
    emoji: '🍯',
    flavor: 'Sweeter interest, same safety.',
    persistent: true,
  },
  {
    id: 'acc_cd_1yr',
    type: 'account',
    accountType: 'cd',
    termYears: 1,
    name: 'CD — 1 Year',
    emoji: '🫙',
    flavor: 'Short commitment, modest reward.',
    persistent: true,
  },
  {
    id: 'acc_cd_2yr',
    type: 'account',
    accountType: 'cd',
    termYears: 2,
    name: 'CD — 2 Years',
    emoji: '🫙',
    flavor: 'Lock it away and let it grow.',
    persistent: true,
  },
  {
    id: 'acc_cd_3yr',
    type: 'account',
    accountType: 'cd',
    termYears: 3,
    name: 'CD — 3 Years',
    emoji: '🫙',
    flavor: 'Patience is its own reward.',
    persistent: true,
  },
  {
    id: 'acc_cd_5yr',
    type: 'account',
    accountType: 'cd',
    termYears: 5,
    name: 'CD — 5 Years',
    emoji: '🫙',
    flavor: 'The long game pays off.',
    persistent: true,
  },
  {
    id: 'acc_credit',
    type: 'account',
    accountType: 'credit_card',
    name: 'Credit Card',
    emoji: '🍃',
    flavor: 'Use wisely — it remembers everything.',
    persistent: true,
    requiresCreditScore: 580,
  },
  {
    id: 'acc_roth',
    type: 'account',
    accountType: 'roth_ira',
    name: 'Roth IRA',
    emoji: '🌻',
    flavor: 'Plant seeds today, harvest tax-free.',
    persistent: true,
  },
  {
    id: 'acc_trad',
    type: 'account',
    accountType: 'trad_ira',
    name: 'Traditional IRA',
    emoji: '🌾',
    flavor: 'Reduce taxes now, pay later.',
    persistent: true,
  },
  {
    id: 'acc_brokerage',
    type: 'account',
    accountType: 'brokerage',
    name: 'Brokerage',
    emoji: '🌳',
    flavor: 'No limits. No shelter. No mercy.',
    persistent: true,
  },
];

export const POSITIVE_EVENT_CARDS = [
  {
    id: 'evt_tax_refund',
    type: 'event',
    subtype: 'positive',
    name: 'Tax Refund!',
    emoji: '📬',
    flavor: 'The government owes you one.',
    effect: { type: 'cash', minAmount: 500, maxAmount: 3000 },
    happinessEffect: 1,
  },
  {
    id: 'evt_inheritance',
    type: 'event',
    subtype: 'positive',
    name: 'Inheritance',
    emoji: '🫖',
    flavor: 'Great-aunt Rosemary left you something.',
    effect: { type: 'cash', minAmount: 5000, maxAmount: 20000 },
    happinessEffect: 2,
  },
  {
    id: 'evt_bonus',
    type: 'event',
    subtype: 'positive',
    name: 'Work Bonus',
    emoji: '🎉',
    flavor: 'Your manager finally noticed.',
    effect: { type: 'cash', minAmount: 1000, maxAmount: 5000 },
    happinessEffect: 1,
  },
  {
    id: 'evt_side_hustle',
    type: 'event',
    subtype: 'positive',
    name: 'Side Hustle',
    emoji: '🧺',
    flavor: 'Your Etsy shop is taking off.',
    effect: { type: 'choice', options: [
      { label: '$500/year for 3 years', type: 'recurring', amount: 500, turns: 3 },
      { label: '$1,000 now', type: 'cash', amount: 1000 },
    ]},
    happinessEffect: 1,
  },
  {
    id: 'evt_garage_sale',
    type: 'event',
    subtype: 'positive',
    name: 'Garage Sale',
    emoji: '🏷️',
    flavor: 'One person\'s clutter, your treasure.',
    effect: { type: 'cash', minAmount: 200, maxAmount: 800 },
    happinessEffect: 1,
  },
  {
    id: 'evt_found_money',
    type: 'event',
    subtype: 'positive',
    name: 'Found Money',
    emoji: '🍀',
    flavor: 'An old jacket pocket. Happy birthday.',
    effect: { type: 'cash', minAmount: 50, maxAmount: 500 },
    happinessEffect: 1,
  },
  {
    id: 'evt_freelance',
    type: 'event',
    subtype: 'positive',
    name: 'Freelance Gig',
    emoji: '✍️',
    flavor: 'They loved your portfolio.',
    effect: { type: 'freelance', amount: 1500, selfEmploymentTax: 0.153 },
    happinessEffect: 1,
  },
  {
    id: 'evt_401k_match',
    type: 'event',
    subtype: 'positive',
    name: 'Employer 401k Match',
    emoji: '🤝',
    flavor: 'Free money — if you put in your share.',
    effect: { type: 'retirement_match', matchRate: 0.04 },
    condition: 'hasRetirementAccount',
    happinessEffect: 1,
  },
  {
    id: 'evt_promotion',
    type: 'event',
    subtype: 'positive',
    name: 'Promotion!',
    emoji: '🌟',
    flavor: 'Corner office, corner budget.',
    effect: { type: 'income_increase', minAmount: 5000, maxAmount: 10000 },
    happinessEffect: 2,
  },
  {
    id: 'evt_cashback',
    type: 'event',
    subtype: 'positive',
    name: 'Cashback Milestone',
    emoji: '💌',
    flavor: 'Your card rewards you for existing.',
    effect: { type: 'cash', minAmount: 100, maxAmount: 300 },
    condition: 'hasCreditCard',
    happinessEffect: 1,
  },
  {
    id: 'evt_dividend',
    type: 'event',
    subtype: 'positive',
    name: 'Dividend Payout',
    emoji: '🌼',
    flavor: 'Your investments pay you back.',
    effect: { type: 'dividend', rate: 0.02 },
    condition: 'hasInvestments',
    happinessEffect: 1,
  },
  {
    id: 'evt_windfall_invest',
    type: 'event',
    subtype: 'special',
    name: 'Windfall Investment',
    emoji: '✨',
    flavor: 'A once-in-a-decade opportunity.',
    effect: { type: 'double_speculative' },
    happinessEffect: 2,
  },
];

export const NEGATIVE_EVENT_CARDS = [
  {
    id: 'evt_car_repair',
    type: 'event',
    subtype: 'negative',
    name: 'Car Repair',
    emoji: '🔧',
    flavor: 'The check engine light was not decorative.',
    effect: { type: 'expense', minAmount: 500, maxAmount: 2000 },
    happinessEffect: -1,
  },
  {
    id: 'evt_medical',
    type: 'event',
    subtype: 'negative',
    name: 'Medical Bill',
    emoji: '🏥',
    flavor: 'You didn\'t see that coming. Neither did your wallet.',
    effect: { type: 'expense', minAmount: 1000, maxAmount: 8000 },
    happinessEffect: -2,
  },
  {
    id: 'evt_job_loss',
    type: 'event',
    subtype: 'negative',
    name: 'Job Loss',
    emoji: '📦',
    flavor: 'The layoffs came quietly, like autumn.',
    effect: { type: 'income_zero', turns: 1 },
    happinessEffect: -3,
  },
  {
    id: 'evt_rent_hike',
    type: 'event',
    subtype: 'negative',
    name: 'Rent Hike',
    emoji: '🏠',
    flavor: 'Your landlord\'s renovation: a new coat of prices.',
    effect: { type: 'expense_increase', minAmount: 1200, maxAmount: 3600, category: 'housing', turns: 3 },
    happinessEffect: -2,
  },
  {
    id: 'evt_identity_theft',
    type: 'event',
    subtype: 'negative',
    name: 'Identity Theft',
    emoji: '🎭',
    flavor: 'Someone has been living your best life.',
    effect: { type: 'multi', effects: [
      { type: 'expense', amount: 500 },
      { type: 'credit_score', delta: -30 },
    ]},
    happinessEffect: -2,
  },
  {
    id: 'evt_market_crash',
    type: 'event',
    subtype: 'negative',
    name: 'Market Crash',
    emoji: '📉',
    flavor: 'The forest floor after a storm.',
    effect: { type: 'market_loss', lossMin: 0.20, lossMax: 0.35 },
    happinessEffect: -1,
  },
  {
    id: 'evt_pet_emergency',
    type: 'event',
    subtype: 'negative',
    name: 'Pet Emergency',
    emoji: '🐾',
    flavor: 'Biscuit ate something she shouldn\'t have.',
    effect: { type: 'expense', minAmount: 800, maxAmount: 3000 },
    happinessEffect: -1,
  },
  {
    id: 'evt_car_totaled',
    type: 'event',
    subtype: 'negative',
    name: 'Car Totaled',
    emoji: '🚗',
    flavor: 'The deer won.',
    effect: { type: 'expense', minAmount: 8000, maxAmount: 20000 },
    happinessEffect: -2,
  },
  {
    id: 'evt_legal',
    type: 'event',
    subtype: 'negative',
    name: 'Legal Dispute',
    emoji: '⚖️',
    flavor: 'Your neighbor, the fence, and 3 months of letters.',
    effect: { type: 'expense', minAmount: 1000, maxAmount: 5000 },
    happinessEffect: -1,
  },
  {
    id: 'evt_inflation',
    type: 'event',
    subtype: 'negative',
    name: 'Inflation Surge',
    emoji: '🎈',
    flavor: 'Everything costs more. No one knows why.',
    effect: { type: 'expense_pct_increase', pct: 0.08, turns: 1 },
    happinessEffect: -1,
  },
];

export const SPECIAL_CARDS = [
  {
    id: 'spc_refinance',
    type: 'event',
    subtype: 'special',
    name: 'Refinance',
    emoji: '📋',
    flavor: 'Better terms for a better you.',
    effect: { type: 'refinance' },
    requiresCreditScore: 680,
    happinessEffect: 1,
  },
  {
    id: 'spc_advisor',
    type: 'event',
    subtype: 'special',
    name: 'Financial Advisor',
    emoji: '🦉',
    flavor: 'The owl knows what\'s coming.',
    effect: { type: 'peek_next_turn' },
    happinessEffect: 1,
  },
  {
    id: 'spc_emergency_reward',
    type: 'event',
    subtype: 'special',
    name: 'Emergency Fund Reward',
    emoji: '🛡️',
    flavor: 'Your past self prepared for this.',
    effect: { type: 'skip_next_negative' },
    condition: 'emergencyFundBuilt',
    happinessEffect: 2,
  },
  {
    id: 'spc_credit_boost',
    type: 'event',
    subtype: 'special',
    name: 'Credit Score Boost',
    emoji: '⭐',
    flavor: 'A dispute resolved in your favor.',
    effect: { type: 'credit_score', delta: 25 },
    happinessEffect: 1,
  },
];

// ─── RECURRING / OPTIONAL INCOME-EXPENSE CARDS ────────────────────────────
// These cards present a choice — the effect.options array lists the choices.
// The player picks one; GameScene resolves via a choice modal.

export const RECURRING_CARDS = [
  // ── Rent / Housing ────────────────────────────────────────────────────────
  {
    id: 'rec_new_place',
    type: 'event',
    subtype: 'neutral',
    name: 'New Place to Rent',
    emoji: '🏡',
    flavor: 'Time to move. Or not.',
    minTurn: 0, maxTurn: 9,
    effect: { type: 'choice', options: [
      { label: 'Budget ($12k/yr)', type: 'expense_set', category: 'housing', amount: 12000, happinessEffect: -1 },
      { label: 'Comfortable ($24k/yr)', type: 'expense_set', category: 'housing', amount: 24000, happinessEffect: 1 },
      { label: 'Luxury ($36k/yr)', type: 'expense_set', category: 'housing', amount: 36000, happinessEffect: 2 },
    ]},
  },

  // ── New Job ───────────────────────────────────────────────────────────────
  {
    id: 'rec_new_job_a',
    type: 'event',
    subtype: 'neutral',
    name: 'Job Opportunity',
    emoji: '💼',
    flavor: 'Three offers on the table.',
    minTurn: 0, maxTurn: 9,
    effect: { type: 'choice', options: [
      { label: 'Same pay + better 401k', type: 'multi', happinessEffect: 1, effects: [
        { type: 'income_set', amount: null },
        { type: 'retirement_match_boost', rate: 0.06 },
      ]},
      { label: '+$10k, lower 401k match', type: 'multi', happinessEffect: 0, effects: [
        { type: 'income_increase', amount: 10000 },
        { type: 'retirement_match_boost', rate: 0.02 },
      ]},
      { label: '+$15k, worse health insurance', type: 'multi', happinessEffect: -1, effects: [
        { type: 'income_increase', amount: 15000 },
        { type: 'expense_increase', category: 'insurance', amount: 1800 },
      ]},
    ]},
  },

  // ── Small Business ────────────────────────────────────────────────────────
  {
    id: 'rec_small_biz',
    type: 'event',
    subtype: 'neutral',
    name: 'Small Business Venture',
    emoji: '🌿',
    flavor: 'Risk and reward, hand in hand.',
    minTurn: 0, maxTurn: 9,
    effect: { type: 'choice', options: [
      { label: 'Launch it ($5k startup cost)', type: 'multi', happinessEffect: 2, effects: [
        { type: 'expense', amount: 5000 },
        { type: 'freelance_recurring', amount: 8000, turns: 3 },
      ]},
      { label: 'Pass for now', type: 'noop', happinessEffect: 0 },
    ]},
  },

  // ── Big Vacation ──────────────────────────────────────────────────────────
  {
    id: 'rec_big_vacation',
    type: 'event',
    subtype: 'neutral',
    name: 'Big Family Vacation',
    emoji: '✈️',
    flavor: 'Memories vs. the budget.',
    minTurn: 0, maxTurn: 9,
    effect: { type: 'choice', options: [
      { label: 'Go all out ($8k)', type: 'expense', amount: 8000, happinessEffect: 3 },
      { label: 'Stay home', type: 'noop', happinessEffect: 0 },
    ]},
  },
];

// ─── LIFECYCLE CARDS (year-gated) ──────────────────────────────────────────

export const LIFECYCLE_CARDS = [
  // ── Get Married (year 3-6 only) ───────────────────────────────────────────
  {
    id: 'lc_married',
    type: 'event',
    subtype: 'neutral',
    name: 'Getting Married',
    emoji: '💍',
    flavor: 'The question has been asked.',
    minTurn: 2, maxTurn: 5,
    effect: { type: 'choice', options: [
      { label: 'Big wedding ($25k)', type: 'multi', happinessEffect: 10, effects: [
        { type: 'expense', amount: 25000 },
        { type: 'income_increase', amount: 30000 },
        { type: 'expense_increase', category: 'misc', amount: 3000 },
      ]},
      { label: 'Elope ($2k)', type: 'multi', happinessEffect: 6, effects: [
        { type: 'expense', amount: 2000 },
        { type: 'income_increase', amount: 30000 },
      ]},
      { label: 'Partner insists on venue ($35k)', type: 'multi', happinessEffect: 8, effects: [
        { type: 'expense', amount: 35000 },
        { type: 'income_increase', amount: 30000 },
        { type: 'expense_increase', category: 'misc', amount: 3000 },
      ]},
    ]},
  },

  // ── Have a Kid (year 7-9 only) ────────────────────────────────────────────
  {
    id: 'lc_have_kid',
    type: 'event',
    subtype: 'neutral',
    name: 'New Baby!',
    emoji: '👶',
    flavor: 'Tiny feet, big budget impact.',
    minTurn: 6, maxTurn: 8,
    effect: { type: 'multi', happinessEffect: 6, effects: [
      { type: 'expense_increase', category: 'misc', amount: 12000 },
      { type: 'expense_increase', category: 'insurance', amount: 2400 },
    ]},
  },
];

// ─── NEW POSITIVE EVENT CARDS ──────────────────────────────────────────────

export const POSITIVE_EVENT_CARDS_2 = [
  {
    id: 'evt_tax_law',
    type: 'event',
    subtype: 'positive',
    name: 'Tax Law Changed',
    emoji: '📜',
    flavor: 'Sometimes the government giveth.',
    effect: { type: 'cash', minAmount: 800, maxAmount: 3500 },
    happinessEffect: 1,
  },
  {
    id: 'evt_class_action',
    type: 'event',
    subtype: 'positive',
    name: 'Class Action Payout',
    emoji: '⚖️',
    flavor: 'You were part of the lawsuit. Surprise!',
    effect: { type: 'cash', minAmount: 200, maxAmount: 2000 },
    happinessEffect: 1,
  },
  {
    id: 'evt_stock_bonus',
    type: 'event',
    subtype: 'positive',
    name: 'Vesting Stock Bonus',
    emoji: '📊',
    flavor: 'Four years of patience, paid out quarterly.',
    effect: { type: 'recurring_cash', amount: 2500, turns: 4 },
    happinessEffect: 1,
  },
  {
    id: 'evt_side_gig',
    type: 'event',
    subtype: 'positive',
    name: 'One-Time Side Gig',
    emoji: '🎂',
    flavor: 'Cake decorator? Tour guide? Basketball coach?',
    effect: { type: 'choice', options: [
      { label: 'Cake Decorating ($800)', type: 'cash', amount: 800, happinessEffect: 1 },
      { label: 'Tour Guide ($1,200)', type: 'cash', amount: 1200, happinessEffect: 1 },
      { label: "Kids' Basketball Coach ($600)", type: 'cash', amount: 600, happinessEffect: 2 },
    ]},
  },
  {
    id: 'evt_inheritance2',
    type: 'event',
    subtype: 'positive',
    name: 'Family Inheritance',
    emoji: '🫖',
    flavor: "A bittersweet surprise from someone you loved.",
    effect: { type: 'cash', minAmount: 10000, maxAmount: 50000 },
    happinessEffect: -2,
  },
];

// ─── NEW NEGATIVE EVENT CARDS ──────────────────────────────────────────────

export const NEGATIVE_EVENT_CARDS_2 = [
  {
    id: 'evt_wrecked_car',
    type: 'event',
    subtype: 'negative',
    name: 'Wrecked Car',
    emoji: '🚗',
    flavor: 'It was totaled. Options on the table.',
    effect: { type: 'choice', options: [
      { label: 'Repair ($3k, insurance +$800/yr)', type: 'multi', happinessEffect: -1, effects: [
        { type: 'expense', amount: 3000 },
        { type: 'expense_increase', category: 'insurance', amount: 800 },
      ]},
      { label: 'Buy new car ($12k, insurance +$1.2k/yr)', type: 'multi', happinessEffect: 0, effects: [
        { type: 'expense', amount: 12000 },
        { type: 'expense_increase', category: 'insurance', amount: 1200 },
      ]},
      { label: 'File insurance (-$2k deductible, rates up)', type: 'multi', happinessEffect: -1, effects: [
        { type: 'expense', amount: 2000 },
        { type: 'expense_increase', category: 'insurance', amount: 1500 },
      ]},
    ]},
    happinessEffect: -1,
  },
  {
    id: 'evt_health_issue',
    type: 'event',
    subtype: 'negative',
    name: 'Health Issue',
    emoji: '🏥',
    flavor: 'An unexpected diagnosis.',
    effect: { type: 'expense', minAmount: 2000, maxAmount: 10000 },
    happinessEffect: -2,
  },
  {
    id: 'evt_small_vacation',
    type: 'event',
    subtype: 'negative',
    name: 'Vacation Decision',
    emoji: '🏕️',
    flavor: 'You could use the break.',
    effect: { type: 'choice', options: [
      { label: 'Nice trip ($3k, +2 happiness)', type: 'expense', amount: 3000, happinessEffect: 2 },
      { label: 'Budget trip ($1.5k, +1 happiness)', type: 'expense', amount: 1500, happinessEffect: 1 },
      { label: 'Skip it', type: 'noop', happinessEffect: 0 },
    ]},
    happinessEffect: 0,
  },
  {
    id: 'evt_get_pet',
    type: 'event',
    subtype: 'negative',
    name: 'Get a Pet!',
    emoji: '🐶',
    flavor: "They're expensive, but worth every penny.",
    effect: { type: 'multi', happinessEffect: 4, effects: [
      { type: 'expense', amount: 2000 },
      { type: 'expense_increase', category: 'misc', amount: 1200 },
    ]},
  },
  {
    id: 'evt_pet_health',
    type: 'event',
    subtype: 'negative',
    name: 'Pet Health Scare',
    emoji: '🐾',
    flavor: 'The vet said to bring them in immediately.',
    effect: { type: 'expense', minAmount: 500, maxAmount: 4000 },
    happinessEffect: -1,
  },
  {
    id: 'evt_flooding',
    type: 'event',
    subtype: 'negative',
    name: 'Apartment Flooding',
    emoji: '🌊',
    flavor: 'Insurance covered some. The rest is on you.',
    effect: { type: 'expense', minAmount: 1500, maxAmount: 5000 },
    happinessEffect: -2,
  },
  {
    id: 'evt_roof_repair',
    type: 'event',
    subtype: 'negative',
    name: 'Roof Repairs',
    emoji: '🏠',
    flavor: "Homeownership: you're always fixing something.",
    effect: { type: 'expense', minAmount: 5000, maxAmount: 20000 },
    happinessEffect: -1,
  },
];

// ─── NEW ACCOUNT CARDS ──────────────────────────────────────────────────────

export const ACCOUNT_CARDS_2 = [
  {
    id: 'acc_auto_refi',
    type: 'account',
    accountType: 'auto_loan',
    name: 'Auto Loan Refi',
    emoji: '🚗',
    flavor: 'Lower your rate, lighten your load.',
    persistent: true,
    effect: { type: 'loan', aprMin: 0.03, aprMax: 0.08, label: 'Auto Loan Refi', category: 'transportation' },
  },
  {
    id: 'acc_home_refi',
    type: 'account',
    accountType: 'home_loan',
    name: 'Home Loan Refi',
    emoji: '🏡',
    flavor: 'Lock in a better mortgage rate.',
    persistent: true,
    effect: { type: 'loan', aprMin: 0.025, aprMax: 0.10, label: 'Home Loan Refi', category: 'housing' },
  },
];

export function buildFullDeck() {
  const deck = [];

  // Account cards appear twice each so players have chances to open them
  const accountPool = [...ACCOUNT_CARDS, ...ACCOUNT_CARDS, ...ACCOUNT_CARDS_2];
  const positivePool = [...POSITIVE_EVENT_CARDS, ...POSITIVE_EVENT_CARDS_2];
  const negativePool = [...NEGATIVE_EVENT_CARDS, ...NEGATIVE_EVENT_CARDS_2];
  const specialPool  = [...SPECIAL_CARDS];
  const recurringPool = [...RECURRING_CARDS];
  // Lifecycle cards are included but gated by minTurn/maxTurn in CardDeck.drawCards
  const lifecyclePool = [...LIFECYCLE_CARDS];

  deck.push(...accountPool);
  deck.push(...positivePool);
  deck.push(...negativePool);
  deck.push(...specialPool);
  deck.push(...recurringPool);
  deck.push(...lifecyclePool);

  return shuffle(deck);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
