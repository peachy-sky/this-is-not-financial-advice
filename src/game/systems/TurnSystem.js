import { STARTING_AGE, STARTING_CREDIT, STARTING_INCOME, TOTAL_TURNS, ACCOUNT_CONFIG, COIN_VALUE } from '../constants.js';
import { calcYearEndTax } from './TaxSystem.js';
import { updateCreditScore } from './CreditSystem.js';
import { generateMarketReturns, applyMarketReturns } from './MarketSystem.js';
import { defaultExpenses, totalExpenses, getExpenseRisks } from './ExpenseSystem.js';

export function createInitialState() {
  return {
    turn: 0,
    age: STARTING_AGE,
    income: STARTING_INCOME,
    creditScore: STARTING_CREDIT,
    accounts: {
      checking: { balance: 0 },
    },
    expenses: defaultExpenses(),
    hand: [],
    resolvedEventIds: new Set(),
    marketHistory: { index: [], growth: [], speculative: [] },
    marketHoldings: {},
    capitalGainsRealized: 0,
    freelanceIncome: 0,
    tradIraContribution: 0,
    pendingRecurring: [],
    creditEvents: [],
    lastTaxReport: null,
    phase: 'start',
    log: [],
  };
}

export function startTurnIncome(state) {
  const coins = Math.floor(state.income / COIN_VALUE);
  return {
    ...state,
    incomingCoins: coins,
    phase: 'action',
  };
}

export function generateInterest(state) {
  const accounts = { ...state.accounts };
  const log = [...state.log];
  for (const [id, acct] of Object.entries(accounts)) {
    const cfg = ACCOUNT_CONFIG[id.replace(/_\d+$/, '')];
    if (!cfg || acct.balance <= 0) continue;
    const rate = acct.interestRate ?? cfg.interestMin ?? 0;
    if (rate <= 0) continue;
    const interest = Math.round(acct.balance * rate);
    accounts[id] = { ...acct, balance: acct.balance + interest };
    if (interest > 0) log.push(`${cfg.label} earned $${interest.toLocaleString()} in interest.`);
  }
  return { ...state, accounts, log };
}

export function matureCDs(state) {
  const accounts = { ...state.accounts };
  const log = [...state.log];
  for (const [id, acct] of Object.entries(accounts)) {
    if (!id.startsWith('cd') || acct.maturesAtTurn == null) continue;
    if (state.turn >= acct.maturesAtTurn) {
      accounts.checking = {
        ...accounts.checking,
        balance: (accounts.checking?.balance ?? 0) + acct.balance,
      };
      delete accounts[id];
      log.push(`CD matured! $${acct.balance.toLocaleString()} moved to Checking.`);
    }
  }
  return { ...state, accounts, log };
}

export function applyMarkets(state) {
  const returns = generateMarketReturns(state.marketHistory);
  const updatedHoldings = applyMarketReturns(state.marketHoldings, returns);
  const history = { ...state.marketHistory };
  for (const id of Object.keys(returns)) {
    history[id] = [...(history[id] || []).slice(-4), returns[id]];
  }
  return { ...state, marketHoldings: updatedHoldings, marketHistory: history, lastMarketReturns: returns };
}

export function processEndOfTurn(state) {
  const taxReport = calcYearEndTax({
    income: state.income,
    tradIraContribution: state.tradIraContribution,
    capitalGainsRealized: state.capitalGainsRealized,
    freelanceIncome: state.freelanceIncome,
  });

  const checking = state.accounts.checking?.balance ?? 0;
  const afterTax = Math.max(0, checking - taxReport.total);
  const expenseTotal = totalExpenses(state.expenses);
  const afterExpenses = Math.max(0, afterTax - expenseTotal);

  const creditCard = state.accounts.credit_card;
  const creditEvents = [...state.creditEvents];
  let creditScore = state.creditScore;
  if (creditCard) {
    const bal = creditCard.spentThisTurn ?? 0;
    const limit = ACCOUNT_CONFIG.credit_card.creditLimit;
    const util = bal / limit;
    if (bal === 0) {
      creditEvents.push({ type: 'paid_in_full' });
    } else if (state.creditCardPaidThisTurn) {
      creditEvents.push({ type: 'paid_partial' });
    } else {
      creditEvents.push({ type: 'missed_payment' });
    }
    if (util > 0.3) creditEvents.push({ type: 'high_utilization' });
    else if (util < 0.1) creditEvents.push({ type: 'low_utilization' });
  }
  creditScore = updateCreditScore(state.creditScore, creditEvents);

  const log = [
    ...state.log,
    `Tax owed: $${taxReport.total.toLocaleString()} (effective rate: ${taxReport.effectiveRate}%)`,
    `Expenses: $${expenseTotal.toLocaleString()}`,
  ];

  return {
    ...state,
    accounts: {
      ...state.accounts,
      checking: { ...state.accounts.checking, balance: afterExpenses },
    },
    creditScore,
    creditEvents: [],
    capitalGainsRealized: 0,
    freelanceIncome: 0,
    tradIraContribution: 0,
    creditCardPaidThisTurn: false,
    lastTaxReport: taxReport,
    log,
    turn: state.turn + 1,
    age: state.age + 1,
    phase: state.turn + 1 >= TOTAL_TURNS ? 'end' : 'start',
  };
}

export function calcNetWorth(state) {
  let total = 0;
  for (const acct of Object.values(state.accounts)) {
    total += acct.balance ?? 0;
  }
  for (const val of Object.values(state.marketHoldings)) {
    total += val;
  }
  return total;
}

export function scoreGame(state) {
  const netWorth = calcNetWorth(state);
  const credit = state.creditScore;
  const savings = state.accounts.savings?.balance ?? 0;
  const hysa = state.accounts.hysa?.balance ?? 0;
  const emergencyFund = (savings + hysa) >= 10000;
  const hasInvestments = Object.keys(state.marketHoldings).length > 0;

  let score = 0;
  score += Math.min(40, Math.round((netWorth / 200000) * 40));
  score += Math.min(20, Math.round(((credit - 300) / 550) * 20));
  if (emergencyFund) score += 10;
  if (hasInvestments) score += 10;
  if (credit >= 800) score += 5;
  if (netWorth >= 100000) score += 5;
  score += Math.min(10, Math.round((state.turn / TOTAL_TURNS) * 10));

  return Math.min(100, score);
}
