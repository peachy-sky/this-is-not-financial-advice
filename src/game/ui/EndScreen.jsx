import React, { useState } from 'react';
import { scoreGame, calcNetWorth } from '../systems/TurnSystem.js';
import { CREDIT_SCORE_TIERS, STAR_THRESHOLDS, ACCOUNT_CONFIG, MARKETS } from '../constants.js';

const TIERS = [
  { min: 85, label: 'Financially Flourishing', emoji: '🌻', color: '#7ab87a' },
  { min: 65, label: 'Steadily Growing',         emoji: '🌿', color: '#a8c87a' },
  { min: 45, label: 'Finding Your Footing',     emoji: '🍂', color: '#d4a843' },
  { min: 0,  label: 'Learning the Hard Way',    emoji: '🪨', color: '#c45050' },
];

function scoreTier(s) {
  return TIERS.find(t => s >= t.min) ?? TIERS[TIERS.length - 1];
}

function creditLabel(score) {
  const t = CREDIT_SCORE_TIERS.find(t => score >= t.min) ?? CREDIT_SCORE_TIERS[CREDIT_SCORE_TIERS.length - 1];
  return `${score} — ${t.label}`;
}

function calcStars(netWorth) {
  if (netWorth >= STAR_THRESHOLDS.three) return 3;
  if (netWorth >= STAR_THRESHOLDS.two)   return 2;
  if (netWorth >= STAR_THRESHOLDS.one)   return 1;
  return 0;
}

function StarDisplay({ stars }) {
  return (
    <div style={{ fontSize: 32, letterSpacing: 6, margin: '10px 0' }}>
      {[1, 2, 3].map(n => (
        <span key={n} style={{ opacity: n <= stars ? 1 : 0.2 }}>⭐</span>
      ))}
    </div>
  );
}

// ─── RETIREMENT PROJECTION ─────────────────────────────────────────────────

const RETIREMENT_AGE = 60;
// Default annual return for investment accounts without a stored rate
const INVEST_DEFAULT_RATE = 0.07;
const ACCOUNT_FALLBACK_RATES = {
  checking:    0,
  savings:     0.003,
  hysa:        0.04,
  credit_card: 0,
  roth_ira:    INVEST_DEFAULT_RATE,
  trad_ira:    INVEST_DEFAULT_RATE,
  brokerage:   INVEST_DEFAULT_RATE,
  cd:          INVEST_DEFAULT_RATE,
};

function projectBalance(balance, rate, years) {
  if (years <= 0 || rate <= 0) return balance;
  return Math.round(balance * Math.pow(1 + rate, years));
}

function buildRetirementData(state) {
  const finalAge = state.age;
  const years    = Math.max(0, RETIREMENT_AGE - finalAge);

  const accountRows = [];
  for (const [key, acct] of Object.entries(state.accounts)) {
    if (!acct || acct.balance <= 0) continue;
    const baseType = key.replace(/_\d+$/, '');
    const cfg      = ACCOUNT_CONFIG[baseType];
    const rate     = acct.interestRate ?? ACCOUNT_FALLBACK_RATES[baseType] ?? 0;
    const projected = projectBalance(acct.balance, rate, years);
    accountRows.push({
      label: cfg?.label ?? key,
      balance: acct.balance,
      rate,
      projected,
    });
  }

  const marketRows = [];
  let totalMarketProjected = 0;
  for (const [marketId, holding] of Object.entries(state.marketHoldings ?? {})) {
    if (!holding || holding <= 0) continue;
    const market = MARKETS[marketId];
    const rate   = market?.meanReturn ?? 0.085;
    const projected = projectBalance(holding, rate, years);
    marketRows.push({
      label: market?.label ?? marketId,
      emoji: market?.emoji ?? '📈',
      balance: holding,
      rate,
      projected,
    });
    totalMarketProjected += projected;
  }

  const totalNow      = accountRows.reduce((s, r) => s + r.balance, 0)
                      + marketRows.reduce((s, r) => s + r.balance, 0);
  const totalRetirement = accountRows.reduce((s, r) => s + r.projected, 0) + totalMarketProjected;

  return { accountRows, marketRows, totalNow, totalRetirement, years, finalAge };
}

function RetirementScreen({ state, onBack, onRestart }) {
  const data = buildRetirementData(state);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(60,48,36,0.88)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1100, fontFamily: 'Nunito',
    }}>
      <div style={{
        background: '#faf6ef', borderRadius: 20,
        padding: '36px 44px', maxWidth: 560, width: '92%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36 }}>🌅</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#4a3f35', margin: '8px 0 4px' }}>
          At Retirement...
        </div>
        <div style={{ fontSize: 13, color: '#8a7a6a', marginBottom: 20 }}>
          Projecting <strong>{data.years} more years</strong> of growth
          (age {data.finalAge} → {RETIREMENT_AGE})
        </div>

        <div style={{ borderTop: '2px dashed #d4c4b0', paddingTop: 16, marginBottom: 8, textAlign: 'left' }}>
          {data.accountRows.map((r, i) => (
            <RetirementRow key={i} {...r} />
          ))}
          {data.marketRows.map((r, i) => (
            <RetirementRow key={`m${i}`} label={`${r.emoji} ${r.label}`} balance={r.balance} rate={r.rate} projected={r.projected} />
          ))}
          {data.accountRows.length === 0 && data.marketRows.length === 0 && (
            <div style={{ fontSize: 13, color: '#8a7a6a', textAlign: 'center', padding: '12px 0' }}>
              No assets to project.
            </div>
          )}
        </div>

        <div style={{ borderTop: '2px solid #4a3f35', paddingTop: 12, marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: '#4a3f35' }}>
            <span>Net Worth at Retirement</span>
            <span style={{ color: '#5a9050' }}>${data.totalRetirement.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: 11, color: '#8a7a6a', marginTop: 4 }}>
            vs. ${data.totalNow.toLocaleString()} today — {data.totalNow > 0 ? `${Math.round((data.totalRetirement / data.totalNow - 1) * 100)}% growth` : ''}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={onBack} style={btnStyle('#8a7a6a')}>← Back</button>
          <button onClick={onRestart} style={btnStyle('#4a3f35')}>Play Again 🌱</button>
        </div>
      </div>
    </div>
  );
}

function RetirementRow({ label, balance, rate, projected }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 0', borderBottom: '1px dashed #e8dcd0', fontSize: 13,
    }}>
      <div>
        <span style={{ fontWeight: 700, color: '#4a3f35' }}>{label}</span>
        <span style={{ fontSize: 10, color: '#a09080', marginLeft: 8 }}>
          {rate > 0 ? `@ ${(rate * 100).toFixed(1)}% APY` : 'no interest'}
        </span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 800, color: '#5a9050' }}>${projected.toLocaleString()}</div>
        <div style={{ fontSize: 10, color: '#a09080' }}>from ${balance.toLocaleString()}</div>
      </div>
    </div>
  );
}

// ─── MAIN END SCREEN ───────────────────────────────────────────────────────

export default function EndScreen({ state, onRestart }) {
  const [showRetirement, setShowRetirement] = useState(false);

  if (showRetirement) {
    return (
      <RetirementScreen
        state={state}
        onBack={() => setShowRetirement(false)}
        onRestart={onRestart}
      />
    );
  }

  const score    = state.finalScore ?? scoreGame(state);
  const tier     = scoreTier(score);
  const netWorth = calcNetWorth(state);
  const stars    = calcStars(netWorth);
  const happiness = state.happiness ?? 10;
  const specialPrize = happiness >= 17 && stars >= 2;

  const rows = [
    { label: 'Final Net Worth',   value: `$${netWorth.toLocaleString()}` },
    { label: 'Credit Score',      value: creditLabel(state.creditScore) },
    { label: 'Years Played',      value: `${state.turn} / 10` },
    { label: 'Income at End',     value: `$${state.income?.toLocaleString()}/yr` },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(60,48,36,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, fontFamily: 'Nunito',
    }}>
      <div style={{
        background: '#faf6ef', borderRadius: 20,
        padding: '40px 48px', maxWidth: 520, width: '90%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)', textAlign: 'center',
      }}>
        <div style={{ fontSize: 52 }}>{tier.emoji}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: tier.color, margin: '8px 0 2px' }}>
          {tier.label}
        </div>

        {/* Stars */}
        <StarDisplay stars={stars} />
        <div style={{ fontSize: 11, color: '#a09080', marginBottom: 4 }}>
          {stars === 0
            ? `Reach $${STAR_THRESHOLDS.one.toLocaleString()} net worth for ⭐`
            : stars === 1
            ? `Reach $${STAR_THRESHOLDS.two.toLocaleString()} for ⭐⭐`
            : stars === 2
            ? `Reach $${STAR_THRESHOLDS.three.toLocaleString()} for ⭐⭐⭐`
            : 'Maximum stars achieved!'}
        </div>

        {/* Happiness */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          margin: '14px 0 6px',
        }}>
          <span style={{ fontSize: 14, color: '#8a6a70', fontWeight: 700 }}>🌸 Happiness</span>
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{
                width: 9, height: 14, borderRadius: 2,
                background: i < happiness ? '#d4849a' : '#e0d4d4',
                border: i < happiness ? 'none' : '1px solid #c0aaaa',
              }} />
            ))}
          </div>
          <span style={{ fontSize: 13, color: '#8a6a70', fontWeight: 700 }}>{happiness}/20</span>
        </div>

        {/* Special prize */}
        {specialPrize && (
          <div style={{
            background: 'linear-gradient(135deg, #ffe4f0, #fff0d4)',
            border: '2px solid #d4849a', borderRadius: 12,
            padding: '10px 18px', margin: '10px 0',
            fontSize: 15, fontWeight: 800, color: '#9a4060',
          }}>
            🎁 You win a special prize! 🎁
          </div>
        )}

        <div style={{ fontSize: 40, fontWeight: 800, color: '#4a3f35', marginTop: 8 }}>
          {score} <span style={{ fontSize: 18, color: '#8a7a6a' }}>/ 100</span>
        </div>

        <div style={{ borderTop: '2px dashed #d4c4b0', margin: '16px 0', paddingTop: 16 }}>
          {rows.map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '5px 0', fontSize: 14, color: '#4a3f35',
            }}>
              <span style={{ color: '#8a7a6a' }}>{r.label}</span>
              <span style={{ fontWeight: 700 }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: '#8a7a6a', fontStyle: 'italic', marginBottom: 20 }}>
          {score >= 85
            ? 'You managed your finances with grace and intention. Well done!'
            : score >= 65
            ? "Solid progress — a few more intentional choices and you'll flourish."
            : score >= 45
            ? 'You\'re getting the hang of it. Each year teaches something new.'
            : 'Finance is a journey, not a destination. Try again!'}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setShowRetirement(true)} style={btnStyle('#6a8a60')}>
            Next →
          </button>
          <button onClick={onRestart} style={btnStyle('#4a3f35')}>
            Play Again 🌱
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = (bg) => ({
  flex: 1, background: bg, color: '#faf6ef',
  border: 'none', borderRadius: 12,
  padding: '12px 0', fontSize: 15, fontWeight: 700,
  fontFamily: 'Nunito', cursor: 'pointer',
});
