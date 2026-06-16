import React, { useState } from 'react';
import { MARKETS } from '../constants.js';

export default function MarketPanel({ holdings, marketHistory, lastReturns, onTrade, onClose }) {
  const [amounts, setAmounts] = useState({});

  const setAmount = (id, val) => setAmounts(prev => ({ ...prev, [id]: Number(val) }));

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, fontFamily: 'Nunito',
    }}>
      <div style={{
        background: '#faf6ef', borderRadius: 16, padding: '28px 32px',
        maxWidth: 500, width: '90%', maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#4a3f35', marginBottom: 16 }}>
          📈 Investment Markets
        </h2>
        {Object.values(MARKETS).map(market => {
          const held = holdings?.[market.id] ?? 0;
          const history = marketHistory?.[market.id] ?? [];
          const lastReturn = lastReturns?.[market.id];
          const returnStr = lastReturn != null
            ? `${lastReturn >= 0 ? '+' : ''}${(lastReturn * 100).toFixed(1)}% this year`
            : '';

          return (
            <div key={market.id} style={{
              marginBottom: 20, padding: 16, borderRadius: 12,
              background: `#${market.color.toString(16).padStart(6, '0')}22`,
              border: `2px solid #${market.color.toString(16).padStart(6, '0')}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#4a3f35' }}>
                  {market.emoji} {market.label}
                </span>
                <span style={{ fontSize: 12, color: lastReturn >= 0 ? '#5a9050' : '#c45050', fontWeight: 700 }}>
                  {returnStr}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#8a7a6a', marginBottom: 8 }}>{market.description}</div>
              <MiniChart history={history} color={market.color} />
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: '#4a3f35' }}>
                Held: ${held.toLocaleString()}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                <input
                  type="number" min="0" step="500"
                  placeholder="Amount $"
                  value={amounts[market.id] ?? ''}
                  onChange={e => setAmount(market.id, e.target.value)}
                  style={{
                    flex: 1, padding: '6px 10px', borderRadius: 8,
                    border: '2px solid #d4c4b0', fontFamily: 'Nunito', fontSize: 13,
                  }}
                />
                <button onClick={() => onTrade?.(market.id, 'buy', amounts[market.id] ?? 0)}
                  style={tradeBtn('#5a9050')}>Buy</button>
                <button onClick={() => onTrade?.(market.id, 'sell', amounts[market.id] ?? 0)}
                  style={tradeBtn('#c45050')}>Sell</button>
              </div>
            </div>
          );
        })}
        <button onClick={onClose} style={{
          width: '100%', background: '#4a3f35', color: '#faf6ef',
          border: 'none', borderRadius: 10, padding: '10px 0',
          fontSize: 15, fontWeight: 700, fontFamily: 'Nunito', cursor: 'pointer',
        }}>Close</button>
      </div>
    </div>
  );
}

function MiniChart({ history, color }) {
  if (!history.length) return <div style={{ height: 30, fontSize: 11, color: '#aaa' }}>No history yet</div>;
  const max = Math.max(...history.map(Math.abs), 0.05);
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 30 }}>
      {history.map((r, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: 3,
          background: r >= 0 ? '#7ab87a' : '#c45050',
          height: `${Math.max(10, (Math.abs(r) / max) * 30)}px`,
          opacity: 0.7 + (i / history.length) * 0.3,
          title: `${(r * 100).toFixed(1)}%`,
        }} />
      ))}
    </div>
  );
}

const tradeBtn = (bg) => ({
  padding: '6px 14px', background: bg, color: '#fff',
  border: 'none', borderRadius: 8, fontSize: 13,
  fontWeight: 700, fontFamily: 'Nunito', cursor: 'pointer',
});
