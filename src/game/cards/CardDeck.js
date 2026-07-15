import { buildNPC1Deck } from './npc1Cards.js';

export default class CardDeck {
  constructor() {
    this.drawPile = buildNPC1Deck();
    this.discardPile = [];
    this.hand = [];
  }

  // currentTurn: 0-indexed. Lifecycle cards only enter the hand if within their minTurn/maxTurn window.
  drawCards(count, currentTurn = 0) {
    const drawn = [];
    const skipped = [];
    for (let i = 0; i < count; i++) {
      if (this.drawPile.length === 0) this._reshuffle();
      if (this.drawPile.length === 0) break;
      const card = this.drawPile.shift();
      // Gate lifecycle / turn-restricted cards
      const minOk = card.minTurn == null || currentTurn >= card.minTurn;
      const maxOk = card.maxTurn == null || currentTurn <= card.maxTurn;
      if (minOk && maxOk) {
        drawn.push(card);
      } else {
        skipped.push(card);
        // Try one more card to fill the slot
        if (this.drawPile.length > 0) {
          drawn.push(this.drawPile.shift());
        }
      }
    }
    // Return gated cards to the bottom so they can be drawn later
    this.drawPile.push(...skipped);
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
