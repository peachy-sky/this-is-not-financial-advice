import { buildFullDeck } from './cardData.js';

export default class CardDeck {
  constructor() {
    this.drawPile = buildFullDeck();
    this.discardPile = [];
    this.hand = [];
  }

  drawCards(count) {
    const drawn = [];
    for (let i = 0; i < count; i++) {
      if (this.drawPile.length === 0) this._reshuffle();
      if (this.drawPile.length > 0) drawn.push(this.drawPile.shift());
    }
    this.hand.push(...drawn);
    return drawn;
  }

  discardHand(persistent = []) {
    const kept = this.hand.filter(c => c.persistent && persistent.includes(c.id));
    const discarded = this.hand.filter(c => !kept.includes(c));
    this.discardPile.push(...discarded);
    this.hand = kept;
    return discarded;
  }

  playCard(cardId) {
    const idx = this.hand.findIndex(c => c.id === cardId);
    if (idx === -1) return null;
    const [card] = this.hand.splice(idx, 1);
    return card;
  }

  getHandEventCards() {
    return this.hand.filter(c => c.type === 'event');
  }

  getHandAccountCards() {
    return this.hand.filter(c => c.type === 'account');
  }

  unresolvedEvents() {
    return this.hand.filter(c => c.type === 'event' && !c._resolved);
  }

  _reshuffle() {
    this.drawPile = [...this.discardPile].sort(() => Math.random() - 0.5);
    this.discardPile = [];
  }
}
