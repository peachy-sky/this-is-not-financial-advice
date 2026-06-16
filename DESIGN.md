# Blitz Card MVP — Game Design Document

> **Vibe:** Cottagecore · Bubbly · Neutral pastel earth tones  
> **Tech stack:** Phaser.js + React.js + HTML/CSS/JS  
> **Scope:** Single-level, 10-turn minigame

---

## Overview

Blitz Card MVP simulates **10 years of personal finance** (ages 25–35) through a card-playing, turn-based board game. Players manage real financial accounts, respond to life events, and try to grow their net worth while keeping their credit score healthy.

---

## Visual Style

| Element | Aesthetic |
|---|---|
| Color palette | Warm sand, dusty rose, sage green, cream, terracotta, muted lilac |
| Font | Rounded, bubbly sans-serif (e.g., Nunito or Comfortaa) |
| Cards | Illustrated with cozy icons (mushrooms, acorns, leaves, jars, coins) |
| Coins | Pastel gold circles with soft drop shadows |
| Board | Parchment-textured felt mat with embroidered-look account slots |
| UI panels | Rounded rect "envelopes" and "notebook pages" |
| Animations | Soft bouncy easing; coins gently tumble when dragged |

---

## Core Stats (tracked throughout all 10 turns)

| Stat | Starting Value | Notes |
|---|---|---|
| **Net Worth** | $0 | Sum of all account balances minus all debts |
| **Age** | 25 | +1 per turn |
| **Year** | 0 | 0–10 |
| **Credit Score** | 600 | 300–850; rises/falls based on payment behavior |
| **Annual Income** | $55,000 | Can be modified via Income Event cards |
| **Annual Expenses** | $38,000 | Broken into categories; can be redistributed |

---

## Turn Structure (10 Turns Total)

Each turn = 1 year of life.

```
┌─────────────────────────────────────────────────────┐
│  START OF TURN                                      │
│  1. Discard non-persistent hand cards               │
│  2. Draw 5 new cards                                │
│  3. Drop income coins onto the board                │
│  4. Generate account interest on all accounts       │
│  5. Mature any CDs whose term is complete           │
├─────────────────────────────────────────────────────┤
│  PLAYER ACTION PHASE                                │
│  • Play Account Cards (optional)                    │
│  • Play Event Cards (REQUIRED before ending turn)   │
│  • Move coins between accounts (drag & drop)        │
│  • Buy/sell investments in IRA/Brokerage            │
│  • Adjust expense categories                        │
│  • Open/close CDs                                   │
├─────────────────────────────────────────────────────┤
│  END OF TURN                                        │
│  1. Pay taxes (auto-calculated, breakdown shown)    │
│  2. Pay mandatory expenses                          │
│  3. Pay credit card balance (or take penalty)       │
│  4. Update credit score                             │
│  5. Animate net worth ticker                        │
│  6. Age + Year counter advances                     │
└─────────────────────────────────────────────────────┘
```

---

## Cash Resource System

- Cash is represented as **coin tokens** on the board
- Each coin = **$1,000**
- Income drops as a stack of coins in the **"Incoming Funds" zone** at turn start
- Coins can be clicked and dragged individually into any account slot
- **Multi-select:** Click and drag a selection box to grab multiple coins at once
- **Ctrl+click:** Select specific individual coins, then drag the group
- Fractional amounts (e.g., interest that doesn't equal $1,000) are represented as a **partial coin** with a dollar label

### Coin Visual States
| State | Appearance |
|---|---|
| Unassigned (in Incoming zone) | Bright pastel gold, glowing border |
| In checking | Soft cream color |
| In savings | Sage green tint |
| In HYSA | Deeper green tint |
| In IRA/Brokerage | Muted lilac |
| In CD (locked) | Terracotta, padlock icon, greyed-out drag |
| Negative / Debt | Red-tinted coin with minus sign |

---

## Account Cards

Account Cards are played onto the board to create permanent account slots. Once placed, they persist every turn unless removed.

### 1. Checking Account
- **Interest:** 0%
- **Purpose:** Primary holding zone for unallocated cash; required to pay expenses
- **Special:** Always available by default (player starts with one)
- **Icon:** A little clay pot

### 2. Savings Account
- **Interest:** 0.1% – 0.5% APY (randomly rolled each game)
- **FDIC insured**
- **Icon:** A piggy bank with flowers

### 3. High-Yield Savings Account (HYSA)
- **Interest:** 2% – 5% APY (randomly rolled each game, fluctuates ±0.5% each turn)
- **Icon:** A honey jar

### 4. Certificate of Deposit (CD)
- **Player chooses term:** 1, 2, 3, 4, or 5 years
- **Interest rate:** Scales with term length (3% for 1-yr → 7% for 5-yr)
- **Coins are locked** for the duration of the term
- **Early withdrawal penalty:** Lose 3 months of interest
- **Multiple CDs** can be open simultaneously (laddering strategy rewarded)
- **Icon:** An acorn in a glass jar, sealed with wax

### 5. Credit Card Account
- **Credit limit:** $10,000 (increases with good credit score)
- **APR:** 20% annually if balance carried over
- **Rewards:** 1.5% cashback on expenses paid through card (added as bonus coins)
- **Player choice:** Route annual expenses through card or pay directly
- **Must be paid off** before end of turn or receive: credit score penalty (−15), interest charge
- **Icon:** A leaf with a sparkle

### 6. Roth IRA
- **Contribution limit:** $7,000/year (hard cap)
- **Tax treatment:** After-tax contributions; **tax-free growth and withdrawals**
- **Access to:** All 3 stock markets
- **Penalty for early withdrawal:** 10% penalty on gains
- **Icon:** A sunflower

### 7. Traditional IRA
- **Contribution limit:** $7,000/year
- **Tax treatment:** Pre-tax contributions; **deductible from taxable income**; taxed on withdrawal
- **Access to:** All 3 stock markets
- **Icon:** A wheat stalk

### 8. Individual Brokerage Account
- **No contribution limit**
- **Tax treatment:** Capital gains tax on profits (long-term: 0%/15%/20%; short-term: ordinary income)
- **Access to:** All 3 stock markets
- **Icon:** A tree with coins as leaves

---

## Investment Markets (for IRA & Brokerage)

Players can buy and sell at any point during their action phase. Prices fluctuate each turn.

### Market A: Index Fund (Low Risk)
- Tracks a fictional "Meadow 500" index
- Average annual return: 7–10%
- Volatility: Low (±2–4%)
- **Icon:** A rolling green hill

### Market B: Growth Fund (Medium Risk)
- Tech/growth stocks basket
- Average annual return: 10–15%
- Volatility: Medium (±8–12%)
- **Icon:** A sprouting seedling with a rocket

### Market C: Speculative Fund (High Risk)
- Small-cap and emerging market basket
- Average annual return: −15% to +40%
- Volatility: High (can crash or boom)
- **Icon:** A mushroom (could be magical or poisonous!)

### Market Mechanics
- Each turn, prices shift before the player's action phase
- A small chart shows the last 3 turns of each market's performance
- Player can invest any dollar amount (minimum $500)
- Gains and losses are realized when sold; unrealized gains show as +/− on the account card

---

## Event Cards

Event Cards are drawn at the start of each turn. **All Event Cards must be resolved before ending the turn.**

### Positive Event Cards (12 unique)

| Card Name | Effect |
|---|---|
| **Tax Refund** | Receive $500–$3,000 in extra coins |
| **Inheritance** | Receive $5,000–$20,000 windfall |
| **Bonus at Work** | Receive $1,000–$5,000 extra income |
| **Side Hustle** | Choose: earn $500/turn for 3 turns OR $1,000 now |
| **Garage Sale** | Receive $200–$800 |
| **Found Money** | Receive $50–$500 |
| **Freelance Gig** | Receive $1,500 but pay self-employment tax (15%) |
| **Employer 401k Match** | If contributing to retirement: receive matching coins |
| **Promotion** | Permanently increase income by $5,000–$10,000 |
| **Cashback Milestone** | If credit card is active: bonus $100–$300 cashback |
| **Dividend Payout** | If investing: receive small dividends from holdings |
| **Rent Income** | (Only if you own a property card) earn rental income |

### Negative Event Cards (12 unique)

| Card Name | Effect |
|---|---|
| **Car Repair** | Pay $500–$2,000 or lose car access (expense penalty) |
| **Medical Bill** | Pay $1,000–$8,000 |
| **Job Loss** | Income drops to $0 for 1 turn; draw "Unemployment" token |
| **Home Repair** | Pay $2,000–$10,000 (only if you played a Home card) |
| **Rent Hike** | Annual expenses increase by $1,200–$3,600 |
| **Identity Theft** | Pay $500 + credit score −30; spend 1 action resolving |
| **Stock Market Crash** | All investment accounts lose 20–35% this turn |
| **Unexpected Baby** | Annual expenses increase $8,000 permanently (for 5 turns) |
| **Pet Emergency** | Pay $800–$3,000 |
| **Car Totaled** | Pay $8,000–$20,000 or take an auto loan |
| **Legal Dispute** | Pay $1,000–$5,000 |
| **Inflation Surge** | Annual expenses increase by 8% this turn |

### Special / Unique Cards (5 unique)

| Card Name | Effect |
|---|---|
| **Refinance** | If you have a loan: reduce interest rate by 1–2%; requires good credit score (680+) |
| **Financial Advisor** | Peek at next turn's event cards; get one investment tip |
| **Emergency Fund Reward** | If savings ≥ $10,000: skip next Negative Event Card |
| **Credit Score Boost** | +25 credit score immediately |
| **Windfall Investment** | Double any single coin placed into Speculative Fund this turn |

---

## Credit Score System

| Action | Credit Score Change |
|---|---|
| Pay credit card in full, on time | +10 |
| Pay credit card (partial, on time) | +3 |
| Miss credit card payment | −15 |
| Credit utilization > 30% | −10/turn |
| Credit utilization < 10% | +5/turn |
| Open new account card | −5 (hard inquiry) |
| Have account open for 3+ turns | +5 (age of credit) |
| Resolve loan on time | +8 |
| Default on loan | −40 |

### Credit Score Tiers

| Score | Label | Benefit |
|---|---|---|
| 300–579 | Poor | Cannot open credit card; high loan rates |
| 580–669 | Fair | Can open credit card; limited benefits |
| 670–739 | Good | Standard benefits |
| 740–799 | Very Good | Credit limit increases; better CD rates |
| 800–850 | Exceptional | Best rates on everything; bonus rewards |

---

## Tax System

Taxes are auto-calculated at end of each turn and shown as a **detailed breakdown panel**.

### 2026 Federal Income Tax Brackets (Approximate, Single Filer)

| Income Range | Rate |
|---|---|
| $0 – $11,925 | 10% |
| $11,925 – $48,475 | 12% |
| $48,475 – $103,350 | 22% |
| $103,350 – $197,300 | 24% |
| $197,300+ | 32%+ |

### Tax-Efficient Accounts (Reduced Effective Rate)

| Account | Tax Treatment |
|---|---|
| Roth IRA | Contributions post-tax; **0% tax on growth/withdrawal** |
| Traditional IRA | Contributions deducted from taxable income this year |
| HSA (if added) | Triple tax-advantaged: deduct, grow, withdraw tax-free for medical |
| Individual Brokerage | Long-term capital gains (held 1+ year): 0%, 15%, or 20% |

### Tax Breakdown Panel
Displayed at end of turn:
```
╔═══════════════════════════════════╗
║  YEAR 3 TAX SUMMARY               ║
║  Gross Income:         $60,000    ║
║  Trad IRA Deduction:  − $7,000    ║
║  Taxable Income:       $53,000    ║
║                                   ║
║  10% on $11,925:       $1,193     ║
║  12% on $36,550:       $4,386     ║
║  22% on $4,525:          $996     ║
║                        ───────    ║
║  Total Tax Owed:       $6,575     ║
║  Effective Rate:        10.96%    ║
╚═══════════════════════════════════╝
```

---

## Expense System

Annual expenses are broken into **categories** that can be redistributed (but not freely cut).

### Expense Categories

| Category | Default | Notes |
|---|---|---|
| Housing (rent/mortgage) | $15,600 | Can decrease if you buy a home card; cannot go below $800/mo |
| Groceries | $3,600 | Decreasing this increases Dining Out |
| Dining Out | $1,800 | Decreasing this increases Groceries |
| Transportation | $3,000 | Includes car costs; decrease = more repair risk |
| Insurance | $2,400 | Decreasing this increases Medical Bill risk |
| Utilities | $1,800 | Fixed; slight variation |
| Entertainment | $1,200 | Freely adjustable |
| Miscellaneous | $1,200 | Catch-all |
| **Total Default** | **$30,600** | |

### Expense Tradeoffs (the "Squeeze" system)

Players can redistribute budget between linked pairs:
- **Groceries ↔ Dining Out** (total stays fixed at $5,400)
- **Insurance ↔ Medical Bill Risk** (lowering insurance increases Negative Medical Event chance)
- **Transportation ↔ Car Repair Risk** (lowering transportation spending increases Car Repair event frequency)
- **Entertainment** can be freely cut or increased (affects happiness score — future feature hook)

---

## Income Gamble System

At the start of any turn, the player may choose to **"Push for a Raise"**:

| Option | Risk | Reward |
|---|---|---|
| **Safe Ask** | No risk | +$2,000–$4,000 income (guaranteed) |
| **Bold Pitch** | 40% chance of job loss for 1 turn | +$8,000–$15,000 income if successful |
| **Side Hustle** | Takes 1 action slot per turn | +$6,000–$12,000 passive income |
| **Freelance Pivot** | Variable income (±30% each turn) | Average +$10,000 but volatile |
| **Go Back to School** | Income −$5,000 for 2 turns | +$15,000 income boost after 2 turns |

---

## Win/Loss Conditions

There is no hard fail state — the game always completes 10 turns.

### End-Screen Score (composite)

| Category | Max Points |
|---|---|
| Net Worth at Year 10 | 40 pts |
| Credit Score at Year 10 | 20 pts |
| Emergency Fund built | 10 pts |
| Investment accounts opened | 10 pts |
| Turns with no missed payments | 10 pts |
| Bonus: Credit score 800+ | 5 pts |
| Bonus: Net worth $100k+ | 5 pts |
| **Total** | **100 pts** |

### Score Tiers

| Score | Label |
|---|---|
| 85–100 | Financially Flourishing 🌻 |
| 65–84 | Steadily Growing 🌿 |
| 45–64 | Finding Your Footing 🍂 |
| 0–44 | Learning the Hard Way 🪨 |

---

## Board Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  YEAR 3 · AGE 28    Net Worth: $12,450    Credit: 710 ▲         │
├────────────────────┬─────────────────────────────────────────────┤
│  HAND (5 cards)    │  BOARD (Account Slots)                      │
│  ┌──┐ ┌──┐ ┌──┐   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  │ │  │ │  │   │  │ Checking │  │ Savings  │  │  HYSA    │  │
│  └──┘ └──┘ └──┘   │  │  ○ ○ ○   │  │  ○ ○     │  │  ○ ○ ○ ○ │  │
│  ┌──┐ ┌──┐        │  └──────────┘  └──────────┘  └──────────┘  │
│  │  │ │  │        │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  └──┘ └──┘        │  │ Roth IRA │  │  Credit  │  │  CD Jar  │  │
│                   │  │ 📈 $3,500│  │  Card    │  │ 🔒 2yr   │  │
│                   │  └──────────┘  └──────────┘  └──────────┘  │
├────────────────────┼─────────────────────────────────────────────┤
│  INCOMING FUNDS    │  TAXES & EXPENSES (Fixed)                   │
│  ○ ○ ○ ○ ○        │  ┌────────────┐  ┌────────────┐             │
│  ○ ○ ○ ○ ○        │  │  TAXES     │  │  EXPENSES  │             │
│  ○ ○ ○ ○ ○        │  │ Owed: $6k  │  │ Owed: $31k │             │
│  (Income drop)    │  └────────────┘  └────────────┘             │
├────────────────────┴─────────────────────────────────────────────┤
│  EVENT CARDS TO RESOLVE:  [Medical Bill: Pay $2,000]             │
│                           [Tax Refund: Receive $1,500] ✓        │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack & File Structure

```
BLITZ-CARD-MVP/
├── public/
│   └── index.html
├── src/
│   ├── main.jsx               # React app entry
│   ├── App.jsx                # Top-level wrapper
│   ├── game/
│   │   ├── GameScene.js       # Main Phaser scene
│   │   ├── UIScene.js         # HUD overlay Phaser scene
│   │   ├── constants.js       # Game config, balance values
│   │   ├── cards/
│   │   │   ├── CardDeck.js    # Deck shuffling and draw logic
│   │   │   ├── AccountCard.js # Account card behavior
│   │   │   ├── EventCard.js   # Positive/negative event logic
│   │   │   └── cardData.js    # All card definitions
│   │   ├── systems/
│   │   │   ├── CoinSystem.js  # Drag-and-drop coin logic
│   │   │   ├── TaxSystem.js   # Tax calculation engine
│   │   │   ├── CreditSystem.js# Credit score logic
│   │   │   ├── MarketSystem.js# Stock market simulation
│   │   │   ├── ExpenseSystem.js# Expense category management
│   │   │   └── TurnSystem.js  # Turn flow orchestration
│   │   └── ui/
│   │       ├── HUD.jsx        # React HUD overlay
│   │       ├── TaxPanel.jsx   # End-of-turn tax breakdown
│   │       ├── ExpensePanel.jsx
│   │       ├── MarketPanel.jsx
│   │       └── EndScreen.jsx  # Final score screen
│   ├── assets/
│   │   ├── cards/             # Card artwork PNGs
│   │   ├── coins/             # Coin sprite sheet
│   │   ├── board/             # Board textures
│   │   └── icons/             # UI icons
│   └── styles/
│       └── global.css
├── package.json
└── vite.config.js
```

---

## Implementation Phases

### Phase 1 — Core Board & Coins
- [ ] Phaser canvas with board layout
- [ ] Coin drag-and-drop system (single, multi-select, ctrl+click)
- [ ] Checking account slot (default, always active)
- [ ] HUD: Net Worth, Age, Year, Credit Score

### Phase 2 — Turn Flow & Cards
- [ ] Turn system (start / action / end)
- [ ] Card deck: draw 5, discard mechanism
- [ ] Account Cards: play onto board, activate slot
- [ ] Event Cards: display, require resolution

### Phase 3 — Accounts & Interest
- [ ] All account types with interest calculations
- [ ] CD system: lock coins, track maturity, early withdrawal
- [ ] Credit card: routing expenses, utilization tracking

### Phase 4 — Financial Systems
- [ ] Tax system with full breakdown panel
- [ ] Expense category system with tradeoffs
- [ ] Credit score logic
- [ ] Income gamble system

### Phase 5 — Markets
- [ ] Market price simulation (3 funds)
- [ ] Buy/sell UI in IRA and Brokerage panels
- [ ] Price history mini-chart

### Phase 6 — Polish
- [ ] Cottagecore art assets
- [ ] Coin animations (bounce, tumble)
- [ ] Sound effects (soft chimes, coin clinks)
- [ ] End screen with score breakdown
- [ ] Tooltips and financial literacy pop-ups

---

## Balance Notes

- Income (~$55k) is intentionally tight against expenses (~$31k) + taxes (~$8k), leaving ~$16k/year to invest
- A player who ignores accounts and just holds checking will end with ~$160k net worth — manageable but unimpressive
- A player who maximizes Roth IRA ($7k/year × 10 years at 9%) ends with ~$230k+ from that alone
- The "sweet spot" score (70–80 pts) should be achievable by a player learning the game naturally
- 90+ pts should require intentional strategy (CD laddering, credit score management, tax optimization)

---

*Generated for the ChloeVibecode project — Blitz Card MVP minigame.*
