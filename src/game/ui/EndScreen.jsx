import React from 'react';
import { scoreGame, calcNetWorth } from '../systems/TurnSystem.js';
import { CREDIT_SCORE_TIERS } from '../constants.js';

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

export default function EndScreen({ state, onRestart }) {
  const score = state.finalScore ?? scoreGame(state);
  const tier = scoreTier(score);
  const netWorth = calcNetWorth(state);

  const rows = [
    { label: 'Final Net Worth',      value: `$${netWorth.toLocaleString()}` },
    { label: 'Credit Score',         value: creditLabel(state.creditScore) },
    { label: 'Years Played',         value: `${state.turn} / 10` },
    { label: 'Income at End',        value: `$${state.income?.toLocaleString()}/yr` },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(60,48,36,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, fontFamily: 'Nunito',
    }}>
      <div style={{
        background: '#faf6ef',
        borderRadius: 20,
        padding: '40px 48px',
        maxWidth: 520,
        width: '90%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 52 }}>{tier.emoji}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: tier.color, margin: '8px 0 4px' }}>
          {tier.label}
        </div>
        <div style={{ fontSize: 48, fontWeight: 800, color: '#4a3f35', marginBottom: 4 }}>
          {score} <span style={{ fontSize: 20, color: '#8a7a6a' }}>/ 100</span>
        </div>
        <div style={{ borderTop: '2px dashed #d4c4b0', margin: '20px 0', paddingTop: 20 }}>
          {rows.map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '6px 0', fontSize: 15, color: '#4a3f35',
            }}>
              <span style={{ color: '#8a7a6a' }}>{r.label}</span>
              <span style={{ fontWeight: 700 }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13, color: '#8a7a6a', fontStyle: 'italic', marginBottom: 28 }}>
          {score >= 85
            ? 'You managed your finances with grace and intention. Well done!'
            : score >= 65
            ? 'Solid progress — a few more intentional choices and you\'ll flourish.'
            : score >= 45
            ? 'You\'re getting the hang of it. Each year teaches something new.'
            : 'Finance is a journey, not a destination. Try again!'}
        </div>
        <button
          onClick={onRestart}
          style={{
            background: '#4a3f35', color: '#faf6ef',
            border: 'none', borderRadius: 12,
            padding: '12px 32px', fontSize: 16, fontWeight: 700,
            fontFamily: 'Nunito', cursor: 'pointer',
          }}
        >
          Play Again 🌱
        </button>
      </div>
    </div>
  );
}
