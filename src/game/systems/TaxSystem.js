import { TAX_BRACKETS_2026, LONG_TERM_CG_BRACKETS } from '../constants.js';

export function calcIncomeTax(taxableIncome) {
  let tax = 0;
  let prev = 0;
  const breakdown = [];
  for (const bracket of TAX_BRACKETS_2026) {
    if (taxableIncome <= prev) break;
    const slice = Math.min(taxableIncome, bracket.upTo) - prev;
    const amount = slice * bracket.rate;
    breakdown.push({ from: prev, to: Math.min(taxableIncome, bracket.upTo), rate: bracket.rate, amount });
    tax += amount;
    prev = bracket.upTo;
  }
  return { tax: Math.round(tax), breakdown };
}

export function calcCapitalGainsTax(gains, income) {
  let tax = 0;
  const bracket = LONG_TERM_CG_BRACKETS.find(b => income <= b.upTo);
  if (bracket) tax = gains * bracket.rate;
  return Math.round(tax);
}

export function calcYearEndTax(state) {
  const {
    income,
    tradIraContribution = 0,
    capitalGainsRealized = 0,
    freelanceIncome = 0,
  } = state;

  const selfEmploymentTax = Math.round(freelanceIncome * 0.153);
  const adjustedIncome = income + freelanceIncome - tradIraContribution;
  const taxableIncome = Math.max(0, adjustedIncome - 14600); // standard deduction 2026

  const { tax: incomeTax, breakdown } = calcIncomeTax(taxableIncome);
  const cgTax = calcCapitalGainsTax(capitalGainsRealized, taxableIncome);
  const total = incomeTax + cgTax + selfEmploymentTax;
  const effectiveRate = adjustedIncome > 0 ? total / adjustedIncome : 0;

  return {
    grossIncome: income + freelanceIncome,
    tradIraDeduction: tradIraContribution,
    taxableIncome,
    incomeTax,
    capitalGainsTax: cgTax,
    selfEmploymentTax,
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 1000) / 10,
    breakdown,
  };
}
