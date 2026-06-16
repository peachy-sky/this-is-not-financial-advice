export function updateCreditScore(score, events) {
  let delta = 0;
  for (const ev of events) {
    switch (ev.type) {
      case 'paid_in_full':    delta += 10; break;
      case 'paid_partial':    delta += 3;  break;
      case 'missed_payment':  delta -= 15; break;
      case 'low_utilization': delta += 5;  break;
      case 'high_utilization': delta -= 10; break;
      case 'new_account':     delta -= 5;  break;
      case 'account_age':     delta += 5;  break;
      case 'loan_resolved':   delta += 8;  break;
      case 'loan_default':    delta -= 40; break;
      case 'identity_theft':  delta -= 30; break;
      case 'credit_boost':    delta += ev.amount || 25; break;
    }
  }
  return Math.min(850, Math.max(300, score + delta));
}

export function creditTier(score) {
  if (score >= 800) return { label: 'Exceptional', color: '#7ab87a' };
  if (score >= 740) return { label: 'Very Good',   color: '#a8c87a' };
  if (score >= 670) return { label: 'Good',         color: '#c8c87a' };
  if (score >= 580) return { label: 'Fair',         color: '#d4a843' };
  return                    { label: 'Poor',         color: '#c45050' };
}

export function creditUtilization(balance, limit) {
  if (limit <= 0) return 0;
  return balance / limit;
}
