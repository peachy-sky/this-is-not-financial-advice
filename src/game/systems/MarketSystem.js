import { MARKETS } from '../constants.js';

export function generateMarketReturns(history = {}) {
  const returns = {};
  for (const [id, market] of Object.entries(MARKETS)) {
    const baseReturn = market.meanReturn;
    const vol = market.volatility;
    const shock = (Math.random() - 0.5) * 2 * vol * 2;
    const r = baseReturn + shock;
    returns[id] = Math.round(r * 1000) / 1000;
  }
  return returns;
}

export function applyMarketReturns(holdings, returns) {
  const updated = {};
  for (const [marketId, amount] of Object.entries(holdings)) {
    const r = returns[marketId] ?? 0;
    updated[marketId] = Math.round(amount * (1 + r));
  }
  return updated;
}

export function investInMarket(holdings, marketId, amount) {
  return {
    ...holdings,
    [marketId]: (holdings[marketId] || 0) + amount,
  };
}

export function sellFromMarket(holdings, marketId, amount) {
  const current = holdings[marketId] || 0;
  const sell = Math.min(current, amount);
  return {
    updated: { ...holdings, [marketId]: current - sell },
    proceeds: sell,
  };
}

export function totalHoldingsValue(holdings) {
  return Object.values(holdings).reduce((s, v) => s + v, 0);
}
