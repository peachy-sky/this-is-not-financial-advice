import React, { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../constants.js';
import { adjustExpense, totalExpenses } from '../systems/ExpenseSystem.js';

export default function ExpensePanel({ expenses, onSave, onClose }) {
  const [local, setLocal] = useState({ ...expenses });

  const adjust = (id, delta) => {
    setLocal(prev => adjustExpense(prev, id, (prev[id] ?? 0) + delta));
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, fontFamily: 'Nunito',
    }}>
      <div style={{
        background: '#faf6ef', borderRadius: 16, padding: '28px 32px',
        maxWidth: 420, width: '90%', maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#4a3f35', marginBottom: 4 }}>
          🧺 Annual Expenses
        </h2>
        <p style={{ fontSize: 12, color: '#8a7a6a', marginBottom: 16 }}>
          Linked categories balance each other. Cutting some raises others.
        </p>
        {EXPENSE_CATEGORIES.map(cat => (
          <div key={cat.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: '1px dashed #e0d4c8',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#4a3f35' }}>{cat.label}</div>
              {cat.linked && <div style={{ fontSize: 10, color: '#b08060' }}>Linked to {cat.linked}</div>}
              {cat.riskOnDecrease && <div style={{ fontSize: 10, color: '#c45050' }}>↓ increases {cat.riskOnDecrease} risk</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => adjust(cat.id, -600)} disabled={cat.fixed}
                style={btnStyle(cat.fixed)}>−</button>
              <span style={{ minWidth: 70, textAlign: 'right', fontWeight: 700, fontSize: 13 }}>
                ${(local[cat.id] ?? 0).toLocaleString()}
              </span>
              <button onClick={() => adjust(cat.id, 600)} disabled={cat.fixed}
                style={btnStyle(cat.fixed)}>+</button>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 16, fontWeight: 800, fontSize: 15, color: '#4a3f35' }}>
          Total: ${totalExpenses(local).toLocaleString()}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button onClick={() => onSave(local)} style={{
            flex: 1, background: '#4a3f35', color: '#faf6ef', border: 'none',
            borderRadius: 10, padding: '10px 0', fontSize: 15, fontWeight: 700,
            fontFamily: 'Nunito', cursor: 'pointer',
          }}>Save</button>
          <button onClick={onClose} style={{
            flex: 1, background: '#d4c4b0', color: '#4a3f35', border: 'none',
            borderRadius: 10, padding: '10px 0', fontSize: 15, fontWeight: 700,
            fontFamily: 'Nunito', cursor: 'pointer',
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = (disabled) => ({
  width: 28, height: 28, borderRadius: 8, border: '2px solid #c4b4a0',
  background: disabled ? '#e8e0d8' : '#fff', cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: 800, fontSize: 16, color: '#4a3f35', opacity: disabled ? 0.4 : 1,
});
