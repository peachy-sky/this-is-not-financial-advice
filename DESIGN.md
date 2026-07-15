# Blitz Card MVP — Game Design Document

> **Vibe:** Cottagecore · Bubbly · Neutral pastel earth tones  
> **Tech stack:** Phaser.js + React.js + HTML/CSS/JS  
> **Scope:** Single-level, 10-turn minigame  
> **Repo:** [peachy-sky/this-is-not-financial-advice](https://github.com/peachy-sky/this-is-not-financial-advice)

---

## Overview

Blitz Card MVP simulates **10 years of personal finance** (ages 25–35) through a card-playing, turn-based board game. Players manage real financial accounts, respond to life events, and try to grow their net worth while keeping their credit score healthy and their happiness up.

---

## Visual Style

| Element | Aesthetic |
|---|---|
| Background | Wood grain texture (tiled PNG) |
| Color palette | Warm sand, dusty rose, sage green, cream, terracotta, muted lilac |
| Font | Nunito (rounded, bubbly sans-serif) |
| Cards | Illustrated with cozy icons (mushrooms, acorns, leaves, jars, coins) |
| Coins | Pastel gold circles; each coin = $1,000 |
| Board | Centered 3/4-width rounded-rect frame on wood background |
| UI buttons | Custom PNG icons (Stock Market, Dictionary, Total Assets) |
| Animations | Soft bouncy easing; coins animate to slots on drop |

---

## Core Stats (tracked throughout all 10 turns)

| Stat | Starting Value | Notes |
|---|---|---|
| **Net Worth** | $0 | Sum of all account balances + market holdings |
| **Age** | 25 | +1 per turn |
| **Year** | 1–10 | Advances each turn |
| **Credit Score** | 600 | 300–850; rises/falls based on payment behavior |
| **Annual Income** | $55,000 | Modified by Income event cards |
| **Annual Expenses** | ~$30,600 | Broken into categories; redistributable |
| **Happiness** | 10 / 20 | Increased/decreased by cards and life events |

---

## Happiness System

- Displayed as a **20-segment bar** at the top of the screen (pink segments)
- Starts at **10/20**
- Cards show their happiness effect in the top-right corner (`+1 🌸` / `-2 🌸`)
- Happiness is shown on the **end screen** alongside stars and score
- **Special prize condition:** happiness ≥ 17 AND stars ≥ 2 → "🎁 You win a special prize!"

### Sample Happiness Effects

| Event | Happiness |
|---|---|
| Promotion, Inheritance, Windfall | +2 |
| Most positive events | +1 |
| Opening a new account | +1 |
| Most negative events | −1 |
| Medical bill, Rent hike, Identity theft, Car totaled | −2 |
| Job Loss | −3 |
| Get a Pet | +4 |
| New Baby | +6 |
| Elope | +6 |
| Big Wedding | +8 to +10 |
| Big vacation | +3 |

---

## Turn Structure (10 Turns Total)

Each turn = 1 year of life.

```
┌─────────────────────────────────────────────────────┐
│  START OF TURN                                      │
│  1. Generate account interest                       │
│  2. Mature any CDs whose term is complete           │
│  3. Apply market returns to holdings                │
│  4. Drop income coins onto the board                │
│  5. Discard old hand; draw 5 new cards              │
│     (lifecycle cards only appear in valid years)    │
├─────────────────────────────────────────────────────┤
│  PLAYER ACTION PHASE                                │
│  • Drag Account Cards onto the board to open them   │
│  • Click Event Cards to resolve them (REQUIRED)     │
│  • Pick choices on multi-option cards               │
│  • Drag coins into / out of accounts                │
│  • Multi-select coins (marquee or Ctrl+click)       │
├─────────────────────────────────────────────────────┤
│  END OF TURN  (click "NEXT YEAR →")                 │
│  1. Pay taxes (auto-calculated, breakdown shown)    │
│  2. Pay mandatory expenses                          │
│  3. Update credit score                             │
│  4. Age + Year counter advances                     │
│  5. Coins remain on board as visual reminders       │
└─────────────────────────────────────────────────────┘
```

---

## Cash Resource System

- Cash is represented as **coin tokens** on the board
- Each coin = **$1,000**
- Income drops as coins near the checking account at turn start
- Coins are dragged into account slots to deposit
- **Account balance** = number of coins physically inside the slot × $1,000
- Dragging a coin **out** of a slot immediately reduces that account's balance
- **Multi-select drag:** Marquee-drag to select a group; all selected coins move together as a rigid unit
- **Ctrl+click:** Select individual coins then drag the group
- Coins **persist** between turns as visual reminders

### Coin Visual States

| State | Color |
|---|---|
| Unassigned / incoming | Pastel gold |
| In checking | Soft cream |
| In savings | Sage green |
| In HYSA | Deeper green |
| In IRA / Brokerage | Muted yellow |
| In CD | Terracotta |

---

## Account System

### Always on the Board
- **Checking Account** — always open, 0% interest, primary holding zone
- **Savings Account** — visible from start; play the Savings card to unlock it

### Opened by Playing Account Cards
All other accounts are **invisible until their card is dragged onto the board**. They appear at the position where the card is dropped, clamped to the board area. Each account card can only be played once.

| Account | Interest / Rate | Notes |
|---|---|---|
| **Savings** | 0.1–0.5% APY | FDIC insured |
| **HYSA** | 2–5% APY | Higher yield, fluctuates |
| **CD (1–5 yr)** | 3–7% APY | Locked for term; higher term = higher rate |
| **Credit Card** | 20% APR if carried | 1.5% cashback; pay off to avoid penalty |
| **Roth IRA** | Market-dependent | After-tax; tax-free growth |
| **Traditional IRA** | Market-dependent | Pre-tax; deducted from taxable income |
| **Brokerage** | Market-dependent | No limits; capital gains tax on profits |
| **Auto Loan Refi** | 3–8% APR | Reduces transportation expense over time |
| **Home Loan Refi** | 2.5–10% APR | Reduces housing expense over time |

---

## Investment Markets (Roth IRA, Trad IRA, Brokerage)

| Market | Name | Avg Return | Volatility |
|---|---|---|---|
| Index Fund | 🌄 Meadow 500 | 8.5% | Low |
| Growth Fund | 🌱 Growth Fund | 12% | Medium |
| Speculative | 🍄 Wild Mushroom Fund | 12% mean | Very High |

---

## Card Types

### Account Cards
Dragged from hand onto the board to open an account at that location. Opening any account gives +1 happiness.

### Event Cards (must all be resolved before ending turn)

**Simple events** — click to resolve immediately.

**Choice events** — clicking opens a modal with 2–3 options; each option shows its happiness effect.

### Recurring / Lifestyle Cards
Present ongoing decisions with tradeoffs:
- **New Place to Rent** — Budget / Comfortable / Luxury (happiness tradeoff)
- **Job Opportunity** — Same pay + better 401k / +$10k lower match / +$15k worse insurance
- **Small Business Venture** — Launch it (startup cost + future income) / Pass
- **Big Family Vacation** — Go all out ($8k, +3 happiness) / Stay home

### Lifecycle Cards (year-gated)
Only appear in their valid year window:

| Card | Years Available | Key Effects |
|---|---|---|
| **Getting Married** | Years 3–6 | Big wedding / Elope / Partner insists; adds second income; +6 to +10 happiness |
| **New Baby** | Years 7–9 | +6 happiness; +$12k misc expenses; +$2.4k insurance/yr |

---

## Full Card List

### Positive Events (17 cards)

| Card | Effect | Happiness |
|---|---|---|
| Tax Refund | +$500–$3,000 cash | +1 |
| Inheritance | +$5,000–$20,000 cash | +2 |
| Work Bonus | +$1,000–$5,000 cash | +1 |
| Side Hustle | $500/yr×3 OR $1,000 now | +1 |
| Garage Sale | +$200–$800 cash | +1 |
| Found Money | +$50–$500 cash | +1 |
| Freelance Gig | +$1,500 (self-employment tax applies) | +1 |
| Employer 401k Match | Retirement match boost | +1 |
| Promotion | Income +$5,000–$10,000 permanently | +2 |
| Cashback Milestone | +$100–$300 (requires credit card) | +1 |
| Dividend Payout | 2% of investment holdings | +1 |
| Windfall Investment | Double a speculative fund deposit | +2 |
| Tax Law Changed | +$800–$3,500 refund | +1 |
| Class Action Payout | +$200–$2,000 cash | +1 |
| Vesting Stock Bonus | +$2,500/yr for 4 turns | +1 |
| One-Time Side Gig | Choose: Cake Decorating / Tour Guide / Basketball Coach | +1 or +2 |
| Family Inheritance | +$10,000–$50,000 cash (bittersweet) | −2 |

### Negative Events (17 cards)

| Card | Effect | Happiness |
|---|---|---|
| Car Repair | −$500–$2,000 | −1 |
| Medical Bill | −$1,000–$8,000 | −2 |
| Job Loss | Income = $0 for 1 turn | −3 |
| Rent Hike | Housing expenses +$1,200–$3,600 | −2 |
| Identity Theft | −$500 + credit −30 | −2 |
| Market Crash | Investment holdings −20–35% | −1 |
| Pet Emergency (old) | −$800–$3,000 | −1 |
| Car Totaled | −$8,000–$20,000 | −2 |
| Legal Dispute | −$1,000–$5,000 | −1 |
| Inflation Surge | Expenses +8% this turn | −1 |
| Wrecked Car | Choice: Repair / Buy new / File insurance | −1 |
| Health Issue | −$2,000–$10,000 | −2 |
| Vacation Decision | Choice: Nice trip / Budget trip / Skip | 0–+2 |
| Get a Pet | −$2,000 + $1,200/yr misc expenses | +4 |
| Pet Health Scare | −$500–$4,000 | −1 |
| Apartment Flooding | −$1,500–$5,000 (insurance partial) | −2 |
| Roof Repairs | −$5,000–$20,000 (homeowners only) | −1 |

### Special Cards (4 cards)

| Card | Effect | Happiness |
|---|---|---|
| Refinance | Reduce interest rate on a loan (680+ credit required) | +1 |
| Financial Advisor | Peek at next turn's events | +1 |
| Emergency Fund Reward | Skip next negative event (if savings ≥ $10k) | +2 |
| Credit Score Boost | Credit score +25 | +1 |

---

## Credit Score System

| Action | Change |
|---|---|
| Pay credit card in full | +10 |
| Pay credit card partial | +3 |
| Miss credit card payment | −15 |
| Credit utilization > 30% | −10 |
| Credit utilization < 10% | +5 |
| Default on loan | −40 |

### Tiers

| Score | Label |
|---|---|
| 800–850 | Exceptional |
| 740–799 | Very Good |
| 670–739 | Good |
| 580–669 | Fair |
| 300–579 | Poor |

---

## Tax System (2026 Federal Brackets, Single Filer)

| Income Range | Rate |
|---|---|
| $0 – $11,925 | 10% |
| $11,925 – $48,475 | 12% |
| $48,475 – $103,350 | 22% |
| $103,350 – $197,300 | 24% |
| $197,300+ | 32% |

- **Standard deduction:** $14,600
- **Trad IRA** contributions deducted from gross income
- **Self-employment tax:** 15.3% on freelance income
- Full breakdown panel shown at end of each turn

---

## Expense System

| Category | Default/yr | Notes |
|---|---|---|
| Housing | $15,600 | Affected by rent/home cards |
| Groceries | $3,600 | Linked to Dining Out |
| Dining Out | $1,800 | Linked to Groceries |
| Transportation | $3,000 | Decrease = more car repair risk |
| Insurance | $2,400 | Decrease = more medical risk |
| Utilities | $1,800 | Fixed |
| Entertainment | $1,200 | Freely adjustable |
| Miscellaneous | $1,200 | Catch-all |

---

## Scoring & End Screen

### Stars (based on final net worth)
| Net Worth | Stars |
|---|---|
| < $50,000 | ⬜ (0 stars) |
| $50,000–$59,999 | ⭐ |
| $60,000–$79,999 | ⭐⭐ |
| $80,000+ | ⭐⭐⭐ |

### Score Tiers (composite 0–100 pts)
| Score | Label |
|---|---|
| 85–100 | Financially Flourishing 🌻 |
| 65–84 | Steadily Growing 🌿 |
| 45–64 | Finding Your Footing 🍂 |
| 0–44 | Learning the Hard Way 🪨 |

### Special Prize
Awarded when: **happiness ≥ 17 AND stars ≥ 2**

### Retirement Projection Screen
After the end screen, a "Next →" button opens a projection screen:
- Shows each account's balance compounded to **age 60**
- Uses each account's stored APY (or 7% default for IRAs/Brokerage, 8.5% for market holdings)
- Displays total projected net worth at retirement

---

## Board Layout

```
┌─────────────────── Happiness Bar (20 segments) ────────────────────┐
│ 🌸 HAPPINESS  [■■■■■■■■■■□□□□□□□□□□]                               │
├──────── Frame (3/4 screen width, centered) ─────────────────────────┤
│  [AGE 25 / YEAR 1]          [NET WORTH: $0]                         │
│                               [CREDIT SCORE: 600]                  │
│ ┌──────────────┐  ┌────────┐  ┌────────┐  ← dynamically placed    │
│ │  EXPENSES    │  │Checking│  │Savings │     accounts appear here  │
│ │  DUE: $30k   │  │  $0    │  │ locked │     when cards are dropped│
│ └──────────────┘  └────────┘  └────────┘                           │
│                                                                      │
│ [📈]                                    [ NEXT YEAR → ]            │
│ [📖]  ← PNG icon buttons                                            │
│ [📋]                                                                │
└──────────────────────────────────────────────────────────────────────┘
        [ card ]  [ card ]  [ card ]  [ card ]  [ card ]
                        Your Hand
```

---

## File Structure

```
BLITZ-CARD-MVP/
├── public/
│   ├── wood-bg.png               # Wood grain background texture
│   ├── buttons-stockmarket.png   # Icon button PNGs
│   ├── buttons-dictionary.png
│   └── buttons-totalassets.png
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── game/
│   │   ├── GameScene.js          # Main Phaser scene (all board logic)
│   │   ├── UIScene.js            # HUD overlay scene
│   │   ├── constants.js          # Balance constants, STAR_THRESHOLDS
│   │   ├── cards/
│   │   │   ├── CardDeck.js       # Deck + turn-gated draw logic
│   │   │   └── cardData.js       # All card definitions (60+ cards)
│   │   ├── systems/
│   │   │   ├── CoinSystem.js     # CoinSprite, drag, stack
│   │   │   ├── TaxSystem.js      # 2026 bracket calculation
│   │   │   ├── CreditSystem.js   # Credit score events
│   │   │   ├── MarketSystem.js   # Market return simulation
│   │   │   ├── ExpenseSystem.js  # Category management
│   │   │   └── TurnSystem.js     # Turn flow, net worth, scoring
│   │   └── ui/
│   │       ├── HUD.jsx           # React stat overlay
│   │       ├── EndScreen.jsx     # Stars, happiness, retirement screen
│   │       ├── TaxPanel.jsx      # Tax breakdown modal
│   │       ├── ExpensePanel.jsx  # Expense adjustment panel
│   │       └── MarketPanel.jsx   # Market trading panel
│   └── styles/
│       └── global.css
├── index.html
├── package.json
├── vite.config.js
└── DESIGN.md
```

---

## Implementation Status

### Done ✅
- Phaser + React + Vite project scaffold
- Wood grain background texture
- 3/4-width centered frame with hanging stat tags
- Happiness bar (20 segments, top of screen)
- Coin drag-and-drop (single, multi-select marquee, Ctrl+click)
- Coins move as rigid group when multi-selected
- Account balance reflects coins physically in slot (live on drag-out)
- Dynamic account placement: drag card → account appears at drop position
- Choice modal for multi-option cards
- Turn-gated lifecycle cards (marriage yr 3–6, baby yr 7–9)
- All 10+ account types with interest
- Full 2026 tax bracket system with end-of-turn breakdown
- Credit score event system
- Market simulation (3 funds)
- Expense category system with tradeoffs
- Star system (1/2/3 stars at $50k/$60k/$80k)
- End screen: stars, happiness, special prize, composite score
- Retirement projection screen (compound interest to age 60)
- PNG icon buttons (Stock Market, Dictionary, Total Assets)
- Coin persistence between turns
- Git repo: peachy-sky/this-is-not-financial-advice

### Planned / Partial
- Stock Market panel (wired to toast placeholder)
- Dictionary / Glossary panel
- Total Assets detail panel
- Sound effects
- Expense adjustment panel (built, not wired to UI)
- CD laddering UI
- Loan / debt coin system for Auto Loan and Home Loan cards

---

*ChloeVibecode project — Blitz Card MVP*
