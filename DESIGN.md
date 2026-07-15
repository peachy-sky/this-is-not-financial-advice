# Blitz Card MVP — Game Design Document

> **Vibe:** Cottagecore · Bubbly · Neutral pastel earth tones  
> **Tech stack:** Phaser.js + React.js + HTML/CSS/JS  
> **Scope:** Single-level, 10-turn minigame  
> **Repo:** [peachy-sky/this-is-not-financial-advice](https://github.com/peachy-sky/this-is-not-financial-advice)

---

## Overview

Blitz Card MVP simulates **10 years of personal finance** (ages 25–35) through a card-playing, turn-based board game. Players manage real financial accounts, respond to life events, and try to grow their net worth while keeping their happiness up.

---

## Visual Style

| Element | Aesthetic |
|---|---|
| Background | Wood grain texture (tiled PNG) |
| Color palette | Warm sand, dusty rose, sage green, cream, terracotta, muted lilac |
| Font | Nunito (rounded, bubbly sans-serif) |
| Cards | Illustrated with cozy icons; card images are per-card PNGs |
| Coins | Pastel gold circles; each coin = $1,000 |
| Board | Centered 3/4-width rounded-rect frame on wood background |
| UI buttons | Custom PNG icons (Stock Market, Dictionary, Total Assets) + NPC icon |
| Animations | Soft bouncy easing; coins animate to slots on drop |

---

## Core Stats (tracked throughout all 10 turns)

| Stat | Starting Value | Notes |
|---|---|---|
| **Net Worth** | $0 | Sum of all account balances + market holdings |
| **Age** | 25 | +1 per turn |
| **Year** | 1–10 | Advances each turn |
| **Credit Score** | 600 | 300–850; tracked in state, not shown on board |
| **Annual Income** | $55,000 | Modified by Income event cards |
| **Annual Expenses** | ~$30,600 | Broken into categories |
| **Happiness Level** | 10 / 20 | Displayed as 10 hearts below the Level Star Bar |

---

## Happiness System

- Displayed as **10 heart icons** directly below the Level Star Bar (same 210px width)
- Each heart represents **2 happiness points** (range 0–20):
  - ♥ **Red** = 2 pts (fully filled)
  - ♥ **Pink** = 1 pt (half filled)
  - ♥ **White** = 0 pts (empty)
- At happiness 10/20: first 5 hearts are red, last 5 are white
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
│  • Play Required Event Cards (MUST resolve first)   │
│  • Play Optional Event Cards at your leisure        │
│  • Pick choices on multi-option cards               │
│  • Drag coins into / out of accounts                │
│  • Multi-select coins (marquee or Ctrl+click)       │
├─────────────────────────────────────────────────────┤
│  END OF TURN  (click "NEXT YEAR →")                 │
│  ⚠ Blocked if any Required Event cards unresolved  │
│  1. Pay taxes (auto-calculated, breakdown shown)    │
│  2. Update credit score                             │
│  3. Age + Year counter advances                     │
│  4. Coins remain on board as visual reminders       │
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

## Card System (Level 1 — npc1Cards.js)

Cards are defined in `src/game/cards/npc1Cards.js`. Each level has its own card file. Cards have individual PNG artwork (`npc1-<id>.png` in `public/`).

### Card Types

| Type | Key | Mechanic |
|---|---|---|
| **Account Card** | `account` | Drag onto board to open a permanent account; opening gives +1 happiness |
| **Optional Event Card** | `event_optional` | Click to play at any time; can be held across turns if unplayed |
| **Required Event Card** | `event_required` | **Must be played before "Next Year" is clicked**; shown with red border and "● DUE" badge; turn button is locked until all are resolved |

### Level 1 Card Pool

**Account Cards (5):** Checking, Savings, High-Yield Savings, Roth IRA, Brokerage

**Optional Event Cards (8):** Tax Refund, Side Gig, Work Bonus, Raise at Work, Cash Gift, Car Repair, Vacation, Windfall (choice card)

**Required Event Cards (4):** Rent, Groceries, Utility Bills, Insurance

### Effect Types

| Effect | Description |
|---|---|
| `cash` / `income` | Spawn coin tokens on the board |
| `expense` / `expense_immediate` | Deduct amount from checking account |
| `income_increase` | Raise annual income permanently |
| `expense_set` | Override a specific expense category |
| `expense_increase` | Increase a specific expense category |
| `credit_score` | Change credit score by delta |
| `multi` | Apply several effects at once |
| `choice` | Open a modal with 2–3 options |
| `noop` | No effect |

---

## Level Star Bar

A **210px wide progress bar** displayed directly below the NET WORTH hanging tag.

- **200 sections**, each representing **$5,000** net worth (total range: $1,000,000)
- **Star markers** at:
  - ⭐ $50,000 (section 10)
  - ⭐⭐ $60,000 (section 12)
  - ⭐⭐⭐ $80,000 (section 16)
- Golden **glow highlight** appears at each marker when net worth reaches that threshold
- Bar fills left-to-right as net worth increases; updates every turn

---

## Expenses Box

The dashed red **EXPENSES** box in the top-left of the board shows two live values:

- **Current Balance** (coins physically inside the box × $1,000) — shown in **green** if ≥ Amount Required, **red** if not
- **Amount Required** (annual expenses total) — shown in dark brown

Format: `$[Current Balance] / $[Amount Required]`

Coins can be dragged into the expenses box; their value immediately counts toward the balance.

---

## Credit Score System

Tracked in game state (influences end-screen score and event card availability) but no longer displayed on the board.

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

## NPC Icon & Budgeting Expenses Window

### NPC Icon
- Located in the **bottom-left corner** of the board
- Displays the Level NPC image (`npc-1-npc-icon.png`)
- Size: **128×128** (twice the size of utility icon buttons)
- The three utility buttons (Stock Market, Dictionary, Total Assets) sit directly above it
- Subtle scale pulse on hover
- Clicking opens the **Budgeting Expenses Window**

### Budgeting Expenses Window
A centered modal panel showing the player's full expense breakdown:
- Terracotta header with NPC thumbnail and "BUDGETING EXPENSES" title
- NPC dialog line: *"Here's what you're spending each year:"*
- Each expense category listed with: emoji · label · dollar amount · proportional mini bar chart
- Total annual expenses at the bottom
- ✕ close button

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
┌────────────── Frame (3/4 screen width, centered) ───────────────────┐
│  [AGE 25 / YEAR 1]          [NET WORTH: $0]                         │
│                              [■■■■□□□□□□□□□□□□□□□□] ← Level Star Bar│
│                              [♥♥♥♥♥♡♡♡♡♡] ← Happiness Hearts (10)  │
│ ┌──────────────┐  ┌────────┐  ┌────────┐  ← dynamically placed     │
│ │  EXPENSES    │  │Checking│  │Savings │     accounts appear here   │
│ │ $0 / $30,600 │  │  $0    │  │ locked │     when cards are dropped │
│ └──────────────┘  └────────┘  └────────┘                            │
│                                                                      │
│ [📈]                                    [ NEXT YEAR → ]            │
│ [📖]  ← utility PNG buttons (64×64)                                 │
│ [📋]                                                                │
│ [NPC]  ← NPC icon (128×128), opens Budget Window                   │
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
│   ├── buttons-stockmarket.png   # Utility icon button PNGs
│   ├── buttons-dictionary.png
│   ├── buttons-totalassets.png
│   ├── npc-1-npc-icon.png        # Level 1 NPC icon
│   └── npc1-<id>.png             # Per-card artwork (one PNG per card)
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── game/
│   │   ├── GameScene.js          # Main Phaser scene (all board logic)
│   │   ├── UIScene.js            # HUD overlay scene
│   │   ├── constants.js          # Balance constants, STAR_THRESHOLDS
│   │   ├── cards/
│   │   │   ├── CardDeck.js       # Deck + turn-gated draw logic
│   │   │   ├── cardData.js       # Legacy card definitions (unused at Level 1)
│   │   │   └── npc1Cards.js      # Level 1 card pool (account / optional / required)
│   │   ├── systems/
│   │   │   ├── CoinSystem.js     # CoinSprite, drag, stack
│   │   │   ├── TaxSystem.js      # 2026 bracket calculation
│   │   │   ├── CreditSystem.js   # Credit score events
│   │   │   ├── MarketSystem.js   # Market return simulation
│   │   │   ├── ExpenseSystem.js  # Category management
│   │   │   └── TurnSystem.js     # Turn flow, net worth, scoring
│   │   └── ui/
│   │       ├── HUD.jsx           # React stat overlay
│   │       ├── EndScreen.jsx     # Stars, happiness hearts, retirement screen
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
- 3/4-width centered frame with hanging stat tags (Age/Year, Net Worth)
- **Level Star Bar** — 210px bar under Net Worth tag; 200 sections × $5k; star markers + glow at $50k/$60k/$80k
- **Happiness hearts** — 10 hearts below star bar; white/pink/red based on happiness level (0–20)
- Coin drag-and-drop (single, multi-select marquee, Ctrl+click)
- Coins move as rigid group when multi-selected
- Account balance reflects coins physically in slot (live on drag-out)
- **Expenses box** — shows live Current Balance / Amount Required; green if met, red if not
- Dynamic account placement: drag card → account appears at drop position
- Choice modal for multi-option cards
- Turn-gated lifecycle cards (marriage yr 3–6, baby yr 7–9)
- All 10+ account types with interest
- Full 2026 tax bracket system with end-of-turn breakdown
- Credit score event system (state-tracked; not displayed on board)
- Market simulation (3 funds)
- Expense category system with tradeoffs
- Star system (1/2/3 stars at $50k/$60k/$80k)
- End screen: stars, happiness hearts, special prize, composite score
- Retirement projection screen (compound interest to age 60)
- PNG icon buttons (Stock Market, Dictionary, Total Assets) — 64×64
- **NPC icon** (128×128) in bottom-left; opens Budgeting Expenses Window
- **Budgeting Expenses Window** — full expense breakdown with mini bar charts
- **npc1Cards.js** — Level 1 card file with account / optional / required card types
- Required event cards: red border, "● DUE" badge, block turn advancement until resolved
- Optional event cards: can be held across turns
- Coin persistence between turns
- Git repo: peachy-sky/this-is-not-financial-advice

### Planned / Partial
- Card artwork PNGs (`npc1-<id>.png`) — structure wired, images to upload
- Stock Market panel (wired to toast placeholder)
- Dictionary / Glossary panel
- Total Assets detail panel
- Sound effects
- CD laddering UI
- Loan / debt coin system for Auto Loan and Home Loan cards

---

*ChloeVibecode project — Blitz Card MVP*
