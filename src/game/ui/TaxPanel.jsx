import React from 'react';

export default function TaxPanel({ report, onClose }) {
  if (!report) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, fontFamily: 'Nunito',
    }}>
      <div style={{
        background: '#faf6ef', borderRadius: 16, padding: '28px 32px',
        maxWidth: 380, width: '90%', boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#4a3f35', marginBottom: 16 }}>
          📋 Tax Summary
        </h2>
        <Row label="Gross Income"       value={`$${report.grossIncome.toLocaleString()}`} />
        <Row label="Trad IRA Deduction" value={`−$${report.tradIraDeduction.toLocaleString()}`} />
        <Row label="Standard Deduction" value={`−$14,600`} />
        <Row label="Taxable Income"     value={`$${report.taxableIncome.toLocaleString()}`} bold />
        <div style={{ borderTop: '1px dashed #d4c4b0', margin: '12px 0' }} />
        {report.breakdown.map((b, i) => (
          <Row key={i}
            label={`${(b.rate * 100).toFixed(0)}% on $${Math.round(b.to - b.from).toLocaleString()}`}
            value={`$${Math.round(b.amount).toLocaleString()}`}
          />
        ))}
        {report.capitalGainsTax > 0 && (
          <Row label="Capital Gains Tax" value={`$${report.capitalGainsTax.toLocaleString()}`} />
        )}
        {report.selfEmploymentTax > 0 && (
          <Row label="Self-Employment Tax" value={`$${report.selfEmploymentTax.toLocaleString()}`} />
        )}
        <div style={{ borderTop: '2px solid #4a3f35', margin: '12px 0' }} />
        <Row label="Total Tax Owed"   value={`$${report.total.toLocaleString()}`} bold />
        <Row label="Effective Rate"   value={`${report.effectiveRate}%`} />
        <button onClick={onClose} style={{
          marginTop: 20, width: '100%', background: '#4a3f35', color: '#faf6ef',
          border: 'none', borderRadius: 10, padding: '10px 0',
          fontSize: 15, fontWeight: 700, fontFamily: 'Nunito', cursor: 'pointer',
        }}>
          Got it
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: '#4a3f35' }}>
      <span style={{ color: bold ? '#4a3f35' : '#8a7a6a' }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 600 }}>{value}</span>
    </div>
  );
}
