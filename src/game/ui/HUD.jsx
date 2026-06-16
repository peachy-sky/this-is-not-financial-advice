import React from 'react';
import { CREDIT_SCORE_TIERS } from '../constants.js';

function creditTier(score) {
  return CREDIT_SCORE_TIERS.find(t => score >= t.min) ?? CREDIT_SCORE_TIERS[CREDIT_SCORE_TIERS.length - 1];
}

export default function HUD({ state }) {
  if (!state) return null;
  const { netWorth = 0, creditScore = 600, turn = 0, age = 25, income = 55000 } = state;
  const tier = creditTier(creditScore);
  const netFmt = netWorth >= 0 ? `+$${netWorth.toLocaleString()}` : `-$${Math.abs(netWorth).toLocaleString()}`;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 56,
      display: 'flex', alignItems: 'center', gap: 24, padding: '0 16px',
      pointerEvents: 'none', zIndex: 10,
    }}>
      <Chip label="Net Worth" value={netFmt} color={netWorth >= 0 ? '#7ab87a' : '#c45050'} />
      <Chip label="Age" value={age} />
      <Chip label="Year" value={`${turn + 1} / 10`} />
      <Chip label="Credit" value={`${creditScore} — ${tier.label}`} color={tier.color} />
      <Chip label="Income" value={`$${income.toLocaleString()}/yr`} color="#d4a843" />
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
      <span style={{ fontSize: 9, color: '#b0a090', fontFamily: 'Nunito', textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 800, color: color ?? '#faf6ef', fontFamily: 'Nunito' }}>
        {value}
      </span>
    </div>
  );
}
