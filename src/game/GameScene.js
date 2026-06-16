import Phaser from 'phaser';
import CardDeck from './cards/CardDeck.js';
import { CoinSprite, COIN_RADIUS, COIN_COLORS } from './systems/CoinSystem.js';
import {
  createInitialState, generateInterest,
  matureCDs, applyMarkets, processEndOfTurn, calcNetWorth, scoreGame,
} from './systems/TurnSystem.js';
import { COLORS, COIN_VALUE, TOTAL_TURNS, ACCOUNT_CONFIG, HAND_SIZE } from './constants.js';
import { totalExpenses } from './systems/ExpenseSystem.js';
import { creditTier } from './systems/CreditSystem.js';

const W = () => window.innerWidth;
const H = () => window.innerHeight;

// Frame: 3/4 the full width, centered, shifted down so rail tags have breathing room
const FRW = () => (W() - 72) * 0.75;
const FRX = () => (W() - FRW()) / 2;
const FRY = 68;

const FR = {
  x:      FRX,
  y:      () => FRY,
  w:      FRW,
  h:      () => H() * 0.74,
  right:  () => FRX() + FRW(),
  bottom: () => FRY + H() * 0.74,
};

// Board content area — inside frame, below the lowest hanging tag
// Credit score sub-tag ends at FR.y() + 78 + 10 + 44 = FR.y() + 132; add 20px gap
const BOARD = {
  top:    () => FR.y() + 152,
  left:   () => FR.x() + 20,
  right:  () => FR.right() - 20,
  bottom: () => FR.bottom() - 20,
};

// Left panel width for expenses box
const LEFT_W = 196;

export default class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  preload() {}

  create() {
    this.state         = createInitialState();
    this.deck          = new CardDeck();
    this.coins         = [];
    this.selectedCoins = [];
    this.accountSlots  = {};
    this.cardObjects   = [];
    this._lastTag      = null;

    this._drawBackground();
    this._drawMainFrame();
    this._drawHangingStats();
    this._drawLeftPanel();
    this._drawAccountSlots();
    this._drawIconButtons();       // bottom-left of frame
    this._drawNextYearButton();    // bottom-right of frame
    this._drawCardHandLabel();     // label above card area, just outside frame
    this._setupInputHandlers();
    this._beginTurn();
  }

  // ─── BACKGROUND ────────────────────────────────────────────────────────────

  _drawBackground() {
    const w = W(), h = H();
    const bg = this.add.graphics();
    bg.fillStyle(0xf0ebe0, 1);
    bg.fillRect(0, 0, w, h);

    const g1 = this.add.graphics();
    g1.fillStyle(0x96b878, 1);
    g1.fillEllipse(w * 0.15, h * 0.93, w * 0.65, h * 0.36);
    g1.fillEllipse(w * 0.72, h * 0.96, w * 0.80, h * 0.32);
    g1.fillRect(0, h * 0.93, w, h * 0.07);

    const g2 = this.add.graphics();
    g2.fillStyle(0xaac882, 1);
    g2.fillEllipse(w * 0.08, h * 0.96, w * 0.44, h * 0.26);
    g2.fillEllipse(w * 0.55, h * 0.97, w * 0.58, h * 0.22);
    g2.fillRect(0, h * 0.96, w, h * 0.04);

    const gw = this.add.graphics();
    gw.fillStyle(0x9ab8d8, 0.55);
    gw.fillEllipse(w * 0.35, h * 1.04, w * 1.4, h * 0.14);

    this._drawBirds(w * 0.84, h * 0.40);
  }

  _drawBirds(bx, by) {
    const g = this.add.graphics();
    g.lineStyle(2.5, 0x7878a8, 1);
    [[bx, by], [bx+30, by-16], [bx-18, by+22], [bx+52, by+8], [bx+14, by+38]].forEach(([x, y]) => {
      g.beginPath(); g.moveTo(x-9, y-5); g.lineTo(x, y); g.lineTo(x+9, y-5); g.strokePath();
    });
  }

  // ─── MAIN FRAME ────────────────────────────────────────────────────────────

  _drawMainFrame() {
    const g = this.add.graphics();
    g.fillStyle(0xfaf6ef, 0.97);
    g.fillRoundedRect(FR.x(), FR.y(), FR.w(), FR.h(), 20);
    g.lineStyle(3.5, 0x3a3028, 1);
    g.strokeRoundedRect(FR.x(), FR.y(), FR.w(), FR.h(), 20);
    // Top rail bar for hanging tags
    g.lineStyle(4, 0x3a3028, 1);
    g.beginPath();
    g.moveTo(FR.x() + 24, FR.y());
    g.lineTo(FR.right() - 24, FR.y());
    g.strokePath();
  }

  // ─── HANGING STATS ─────────────────────────────────────────────────────────

  _drawHangingStats() {
    const fw   = FR.w();
    const railY = FR.y();

    const { textObj: ageText } = this._makeHangingTag(FR.x() + fw * 0.24, railY, 174, 54, 'AGE 25  /  YEAR 1', 22);
    this.hudAge = ageText;

    const nwX = FR.x() + fw * 0.60;
    const { textObj: nwText } = this._makeHangingTag(nwX, railY, 210, 54, 'NET WORTH:  $0', 22);
    this.hudNetWorth = nwText;

    const { textObj: crText } = this._makeHangingTag(nwX, railY + 78, 190, 44, 'CREDIT SCORE: 600', 10, true);
    this.hudCredit = crText;
  }

  _makeHangingTag(cx, railY, tagW, tagH, label, stemH = 20, small = false) {
    const g    = this.add.graphics();
    const tagX = cx - tagW / 2;
    const tagY = railY + stemH;

    g.lineStyle(2, 0x3a3028, 1);
    g.beginPath(); g.moveTo(cx, railY); g.lineTo(cx, tagY); g.strokePath();

    g.fillStyle(0xfaf6ef, 1);
    g.fillRoundedRect(tagX, tagY, tagW, tagH, 9);
    g.lineStyle(2.5, 0x3a3028, 1);
    g.strokeRoundedRect(tagX, tagY, tagW, tagH, 9);

    const textObj = this.add.text(cx, tagY + tagH / 2, label, {
      fontSize: small ? '12px' : '14px', fontFamily: 'Nunito', fontStyle: 'bold', color: '#3a3028',
    }).setOrigin(0.5);

    return { g, textObj };
  }

  // ─── LEFT PANEL (expenses) ─────────────────────────────────────────────────

  _drawLeftPanel() {
    const x = BOARD.left();
    const y = BOARD.top();

    this.add.text(x, y - 16, 'Taxes', {
      fontSize: '12px', fontFamily: 'Nunito', color: '#b09080', fontStyle: 'italic',
    });

    const ew = LEFT_W, eh = 110;
    const eg = this.add.graphics();
    eg.fillStyle(0xfff0f0, 1);
    eg.fillRoundedRect(x, y, ew, eh, 8);
    this._dashedRect(eg, x, y, ew, eh, 0xc45050, 7, 5);

    this.add.text(x + 10, y + 10, 'EXPENSES', {
      fontSize: '13px', fontFamily: 'Nunito', fontStyle: 'bold', color: '#c45050',
    });
    this.expText = this.add.text(x + 10, y + 32, `DUE: $${totalExpenses(this.state.expenses).toLocaleString()}`, {
      fontSize: '12px', fontFamily: 'Nunito', color: '#6a3030',
    });

    this.expDropZone = this.add.zone(x + ew / 2, y + eh / 2, ew, eh).setRectangleDropZone(ew, eh);
    this.expSlotPos  = { x: x + ew / 2, y: y + eh / 2 };
  }

  // ─── ACCOUNT SLOTS ─────────────────────────────────────────────────────────

  _drawAccountSlots() {
    const ax   = BOARD.left() + LEFT_W + 22;
    const ay   = BOARD.top();
    const cardW = 172, cardH = 126, gapX = 16, gapY = 16;

    // Fit as many as possible in available width
    const positions = [
      { type: 'checking',    col: 0, row: 0 },
      { type: 'savings',     col: 1, row: 0 },
      { type: 'hysa',        col: 2, row: 0 },
      { type: 'roth_ira',    col: 3, row: 0 },
      { type: 'trad_ira',    col: 4, row: 0 },
      { type: 'credit_card', col: 0, row: 1 },
      { type: 'brokerage',   col: 1, row: 1 },
    ];

    positions.forEach(({ type, col, row }) => {
      this._createAccountSlot(type, ax + col * (cardW + gapX), ay + row * (cardH + gapY), cardW, cardH);
    });
  }

  _createAccountSlot(type, x, y, w, h) {
    const cfg    = ACCOUNT_CONFIG[type];
    if (!cfg) return;
    const isOpen = type === 'checking' || !!this.state.accounts[type];

    const borderColors = {
      checking: 0x3a3028, savings: 0x789060, hysa: 0x4a9040,
      credit_card: 0xc45050, roth_ira: 0xb09820, trad_ira: 0x808040, brokerage: 0x508050,
    };
    const borderCol = borderColors[type] ?? 0x8a7060;

    const g = this.add.graphics();
    g.fillStyle(0xfaf6ef, isOpen ? 1 : 0.5);
    g.fillRoundedRect(x, y, w, h, 10);
    if (isOpen) {
      this._dashedRect(g, x, y, w, h, borderCol, 7, 5);
    } else {
      g.lineStyle(1.5, borderCol, 0.4);
      g.strokeRoundedRect(x, y, w, h, 10);
    }

    // Rate badge
    const rate     = this._rollInterestRate(type);
    const rateLabel = cfg.interestMax > 0 ? `${(rate * 100).toFixed(0)}%` : '0%';
    const badgeX   = x + w - 20, badgeY = y + 18;
    const badge    = this.add.graphics();
    badge.fillStyle(borderCol, isOpen ? 1 : 0.3);
    badge.fillCircle(badgeX, badgeY, 16);
    this.add.text(badgeX, badgeY, rateLabel, {
      fontSize: '10px', fontFamily: 'Nunito', fontStyle: 'bold', color: '#faf6ef',
    }).setOrigin(0.5);

    this.add.text(x + 10, y + 10, cfg.label.toUpperCase(), {
      fontSize: '11px', fontFamily: 'Nunito', fontStyle: 'bold',
      color: isOpen ? '#3a3028' : '#b0a090',
    });
    const balText = this.add.text(x + 10, y + 28, '$0', {
      fontSize: '13px', fontFamily: 'Nunito', fontStyle: 'bold',
      color: isOpen ? '#3a5028' : '#b0a090',
    });

    let lockText = null;
    if (!isOpen) {
      lockText = this.add.text(x + w / 2, y + h / 2 + 10, 'play card\nto open', {
        fontSize: '11px', fontFamily: 'Nunito', color: '#b0a090', align: 'center',
      }).setOrigin(0.5);
    }

    const dropZone = this.add.zone(x + w / 2, y + h / 2, w, h).setRectangleDropZone(w, h);

    this.accountSlots[type] = { x, y, w, h, gfx: g, badge, balText, lockText, dropZone, type, active: isOpen, rate };

    if (isOpen && !this.state.accounts[type]) {
      this.state.accounts[type] = { balance: 0, interestRate: rate };
    }
  }

  _rollInterestRate(type) {
    const cfg = ACCOUNT_CONFIG[type];
    if (!cfg?.interestMin) return 0;
    return cfg.interestMin + Math.random() * (cfg.interestMax - cfg.interestMin);
  }

  // ─── ICON BUTTONS — bottom-left of frame ───────────────────────────────────

  _drawIconButtons() {
    const btnH  = 42;
    const gap   = 10;
    const total = 3 * btnH + 2 * gap;
    const x     = BOARD.left() + 6;
    // Stack them just above the bottom edge of the frame
    const startY = FR.bottom() - total - 18;

    const buttons = [
      { icon: '📈', label: 'STOCK MARKET', action: () => this._openMarketPanel() },
      { icon: '📖', label: 'DICTIONARY',   action: () => this._openGlossary()    },
      { icon: '📋', label: 'TOTAL ASSETS', action: () => this._openAssetsList()  },
    ];

    buttons.forEach(({ icon, label, action }, i) => {
      const by = startY + i * (btnH + gap);
      const cx = x + 20, cy = by + btnH / 2;
      const circle = this.add.graphics();
      const drawCircle = (fill) => {
        circle.clear();
        circle.fillStyle(fill, 1);
        circle.fillCircle(cx, cy, 20);
        circle.lineStyle(2.5, 0x3a3028, 1);
        circle.strokeCircle(cx, cy, 20);
      };
      drawCircle(0xfaf6ef);

      this.add.text(cx, cy, icon, { fontSize: '17px' }).setOrigin(0.5);
      this.add.text(cx + 28, cy, label, {
        fontSize: '11px', fontFamily: 'Nunito', fontStyle: 'bold', color: '#3a3028',
      }).setOrigin(0, 0.5);

      const zone = this.add.zone(cx, cy, 44, btnH).setInteractive({ useHandCursor: true });
      zone.on('pointerdown', action);
      zone.on('pointerover', () => drawCircle(0xe8e0d0));
      zone.on('pointerout',  () => drawCircle(0xfaf6ef));
    });
  }

  // ─── NEXT YEAR BUTTON — bottom-right of frame ──────────────────────────────

  _drawNextYearButton() {
    const bx = FR.right() - 22;
    const by = FR.bottom() - 22;

    // Draw pill background
    const g = this.add.graphics();
    const pw = 180, ph = 38;
    const px = bx - pw, py = by - ph;
    g.fillStyle(0x3a3028, 1);
    g.fillRoundedRect(px, py, pw, ph, 10);

    const btn = this.add.text(bx - pw / 2, by - ph / 2, 'NEXT YEAR  →', {
      fontSize: '15px', fontFamily: 'Nunito', fontStyle: 'bold', color: '#faf6ef',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => { g.clear(); g.fillStyle(0x5a4838, 1); g.fillRoundedRect(px, py, pw, ph, 10); });
    btn.on('pointerout',  () => { g.clear(); g.fillStyle(0x3a3028, 1); g.fillRoundedRect(px, py, pw, ph, 10); });
    btn.on('pointerdown', () => this._onEndTurn());
  }

  // ─── CARD HAND LABEL (just outside frame bottom) ───────────────────────────

  _drawCardHandLabel() {
    this.add.text(W() / 2, FR.bottom() + 6, 'Your Hand', {
      fontSize: '11px', fontFamily: 'Nunito', color: '#8a7a6a', fontStyle: 'italic',
    }).setOrigin(0.5, 0);
  }

  // ─── TURN FLOW ─────────────────────────────────────────────────────────────

  _beginTurn() {
    this.state = generateInterest(this.state);
    this.state = matureCDs(this.state);
    this.state = applyMarkets(this.state);
    this._dropIncome();
    this.deck.discardHand();
    this.deck.drawCards(HAND_SIZE);
    this._renderCards();
    this._refreshUI();
  }

  _dropIncome() {
    const coinCount = Math.floor(this.state.income / COIN_VALUE);
    const slot = this.accountSlots['checking'];
    // Drop new income coins in the center-board area (not inside any account)
    const cx = slot ? slot.x + slot.w / 2 : BOARD.left() + LEFT_W + 120;
    const cy = BOARD.top() + (slot ? slot.h + 28 : 80);

    for (let i = 0; i < coinCount; i++) {
      const ox = (Math.random() - 0.5) * 130;
      const oy = (Math.random() - 0.5) * 44;
      const coin = new CoinSprite(this, cx + ox, cy + oy, 'incoming');
      coin.container.setDepth(20);
      this.coins.push({ coin, accountType: 'incoming', amount: COIN_VALUE });
      this._attachCoinEvents(coin);
    }
  }

  // ─── COIN DRAG & DROP ──────────────────────────────────────────────────────

  _attachCoinEvents(coinSprite) {
    coinSprite.container.on('pointerdown', (ptr, lx, ly, ev) => {
      if (!ev.ctrlKey && !this.selectedCoins.includes(coinSprite)) this._clearSelection();
      ev.ctrlKey ? this._toggleSelect(coinSprite) : this._selectCoin(coinSprite);
    });
  }

  _selectCoin(coin)   { if (!this.selectedCoins.includes(coin)) { this.selectedCoins.push(coin); coin.setSelected(true); } }
  _toggleSelect(coin) {
    const i = this.selectedCoins.indexOf(coin);
    if (i >= 0) { this.selectedCoins.splice(i, 1); coin.setSelected(false); }
    else        { this._selectCoin(coin); }
  }
  _clearSelection()   { this.selectedCoins.forEach(c => c.setSelected(false)); this.selectedCoins = []; }

  _setupInputHandlers() {
    this.input.on('dragstart', (ptr, obj) => obj.setDepth(100));

    this.input.on('drag', (ptr, obj, dx, dy) => {
      obj.setPosition(dx, dy);
      if (this.selectedCoins.length > 1) {
        const lead = this.selectedCoins[0];
        if (obj === lead.container) {
          this.selectedCoins.slice(1).forEach((c, i) => {
            c.container.setPosition(dx + (i + 1) * 8, dy + (i + 1) * 8);
          });
        }
      }
    });

    this.input.on('drop', (ptr, obj, zone) => {
      const slot = this._findSlotByZone(zone);
      if (slot && slot.active) {
        const toMove = this.selectedCoins.length > 0
          ? [...this.selectedCoins]
          : [this._findCoinByContainer(obj)].filter(Boolean);
        toMove.forEach(c => this._placeCoinInSlot(c, slot.type));
        this._clearSelection();
      }
      obj.setDepth(20);
    });

    this.input.on('dragend', (ptr, obj, dropped) => {
      if (!dropped) obj.setDepth(20);
    });

    // Marquee selection
    let msStart = null, msRect = null;
    this.input.on('pointerdown', (ptr) => { msStart = { x: ptr.worldX, y: ptr.worldY }; });
    this.input.on('pointermove', (ptr) => {
      if (!msStart || !ptr.isDown) return;
      if (!msRect) { msRect = this.add.graphics().setDepth(200); }
      msRect.clear();
      const rx = Math.min(msStart.x, ptr.worldX), ry = Math.min(msStart.y, ptr.worldY);
      const rw = Math.abs(ptr.worldX - msStart.x), rh = Math.abs(ptr.worldY - msStart.y);
      msRect.fillStyle(0xc4714a, 0.12);
      msRect.lineStyle(2, 0xc4714a, 1);
      msRect.fillRect(rx, ry, rw, rh);
      msRect.strokeRect(rx, ry, rw, rh);
    });
    this.input.on('pointerup', (ptr) => {
      if (msStart && msRect) {
        const rx = Math.min(msStart.x, ptr.worldX), ry = Math.min(msStart.y, ptr.worldY);
        const rw = Math.abs(ptr.worldX - msStart.x), rh = Math.abs(ptr.worldY - msStart.y);
        if (rw > 12 && rh > 12) {
          this._clearSelection();
          this.coins.forEach(({ coin }) => {
            if (coin.x >= rx && coin.x <= rx + rw && coin.y >= ry && coin.y <= ry + rh)
              this._selectCoin(coin);
          });
        }
        msRect.destroy(); msRect = null;
      }
      msStart = null;
    });
  }

  _findSlotByZone(zone) {
    return Object.values(this.accountSlots).find(s => s.dropZone === zone) ?? null;
  }
  _findCoinByContainer(container) {
    return this.coins.find(c => c.coin.container === container)?.coin ?? null;
  }

  _placeCoinInSlot(coinSprite, slotType) {
    const slot = this.accountSlots[slotType];
    if (!slot?.active) return;
    const entry = this.coins.find(c => c.coin === coinSprite);
    if (!entry) return;
    entry.accountType = slotType;
    coinSprite.accountType = slotType;

    // Stack coins loosely: random pile near the bottom-center of the account card
    const cx = slot.x + slot.w / 2 + (Math.random() - 0.5) * (slot.w * 0.44);
    const cy = slot.y + slot.h * 0.68 + (Math.random() - 0.5) * 14;
    coinSprite.moveTo(cx, cy);

    this._syncAccountBalance(slotType);
  }

  _syncAccountBalance(type) {
    const count   = this.coins.filter(c => c.accountType === type).length;
    const balance = count * COIN_VALUE;
    if (!this.state.accounts[type]) this.state.accounts[type] = { balance: 0 };
    this.state.accounts[type].balance = balance;
    const slot = this.accountSlots[type];
    if (slot?.balText) slot.balText.setText(`$${balance.toLocaleString()}`);
    this._refreshHUD();
  }

  // ─── CARD RENDERING — flat spread, all text readable ───────────────────────

  _renderCards() {
    this.cardObjects.forEach(o => o.destroy?.());
    this.cardObjects = [];

    const hand = this.deck.hand;
    const n    = hand.length;
    if (n === 0) return;

    const cardW   = 118, cardH = 148;
    // Spread cards evenly across screen width, no crowding
    const maxSpread = W() - 120;
    const spacing   = Math.min(148, maxSpread / Math.max(n, 1));
    const totalW    = spacing * (n - 1);
    const startX    = W() / 2 - totalW / 2;
    // Cards sit just below the frame with room to show fully
    const cardY     = FR.bottom() + cardH / 2 + 22;

    hand.forEach((card, i) => {
      const cx = startX + i * spacing;
      // Gentle tilt only — max ±4° at the edges so text stays readable
      const tilt = n > 1 ? ((i / (n - 1)) - 0.5) * 8 : 0;
      const obj  = this._makeCardObject(card, cx, cardY, cardW, cardH, tilt);
      obj.setDepth(5 + i);
      this.cardObjects.push(obj);
    });
  }

  _makeCardObject(card, cx, cy, w, h, rotateDeg = 0) {
    const container = this.add.container(cx, cy);

    let fillColor = 0xfaf6ef;
    if (card.subtype === 'positive') fillColor = 0xd8f0d0;
    if (card.subtype === 'negative') fillColor = 0xf8d8d0;
    if (card.subtype === 'special')  fillColor = 0xe8e0f8;
    if (card.type === 'account')     fillColor = 0xf8f0e0;

    const bg = this.add.graphics();
    bg.fillStyle(fillColor, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    bg.lineStyle(2, 0xa09080, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

    // Colour stripe at top
    const stripeColor = card.subtype === 'positive' ? 0x7ab87a
      : card.subtype === 'negative' ? 0xc45050
      : card.type === 'account'     ? 0xd4a843
      : 0xb8a8c8;
    bg.fillStyle(stripeColor, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, 20, { tl: 10, tr: 10, bl: 0, br: 0 });

    const emoji  = this.add.text(0, -h / 2 + 34, card.emoji ?? '🃏', { fontSize: '22px' }).setOrigin(0.5);
    const name   = this.add.text(0, -h / 2 + 58, card.name, {
      fontSize: '12px', fontFamily: 'Nunito', fontStyle: 'bold', color: '#3a3028',
      wordWrap: { width: w - 14 }, align: 'center',
    }).setOrigin(0.5);

    let subLine = '';
    if (card.type === 'account' && card.accountType) {
      const cfg = ACCOUNT_CONFIG[card.accountType];
      if (cfg?.interestMax > 0)
        subLine = `${(cfg.interestMin * 100).toFixed(1)}–${(cfg.interestMax * 100).toFixed(1)}% APY`;
    } else if (card.effect?.minAmount) {
      subLine = `$${card.effect.minAmount.toLocaleString()}–$${card.effect.maxAmount.toLocaleString()}`;
    }
    const sub = this.add.text(0, h / 2 - 38, subLine, {
      fontSize: '10px', fontFamily: 'Nunito', color: '#6a5f55', fontStyle: 'italic',
    }).setOrigin(0.5);

    const flavor = this.add.text(0, h / 2 - 18, card.flavor ?? '', {
      fontSize: '8px', fontFamily: 'Nunito', color: '#8a7a6a',
      wordWrap: { width: w - 14 }, align: 'center',
    }).setOrigin(0.5, 1);

    container.add([bg, emoji, name, sub, flavor]);
    container.setSize(w, h);
    container.setInteractive({ useHandCursor: true });
    container.setAngle(rotateDeg);
    container.setDepth(5);

    // Hover: scale to 2× and rise so the enlarged card stays on screen
    container.on('pointerover', () => {
      container.setDepth(200);
      this.tweens.add({
        targets: container,
        scaleX: 2, scaleY: 2,
        y: cy - h * 0.85,   // shift upward so 2× card clears the screen edge
        angle: 0,
        duration: 180,
        ease: 'Back.easeOut',
      });
    });
    container.on('pointerout', () => {
      container.setDepth(5);
      this.tweens.add({
        targets: container,
        scaleX: 1, scaleY: 1,
        y: cy,
        angle: rotateDeg,
        duration: 160,
        ease: 'Power2',
      });
    });
    container.on('pointerdown', () => this._onCardClick(card, container));

    return container;
  }

  _onCardClick(card, container) {
    if (card.type === 'account') this._playAccountCard(card, container);
    else if (card.type === 'event') this._resolveEventCard(card, container);
  }

  _playAccountCard(card, container) {
    const type = card.accountType;
    const slot = this.accountSlots[type];
    if (!slot) return;

    slot.active = true;
    slot.lockText?.setText('');
    slot.gfx.clear();
    slot.gfx.fillStyle(0xfaf6ef, 1);
    slot.gfx.fillRoundedRect(slot.x, slot.y, slot.w, slot.h, 10);
    const borderColors = { checking: 0x3a3028, savings: 0x789060, hysa: 0x4a9040, credit_card: 0xc45050, roth_ira: 0xb09820, trad_ira: 0x808040, brokerage: 0x508050 };
    this._dashedRect(slot.gfx, slot.x, slot.y, slot.w, slot.h, borderColors[type] ?? 0x8a7060, 7, 5);

    if (!this.state.accounts[type]) {
      this.state.accounts[type] = { balance: 0, interestRate: slot.rate };
    }
    slot.balText?.setStyle({ color: '#3a5028' });

    this.deck.playCard(card.id);
    container.destroy();
    this.cardObjects = this.cardObjects.filter(c => c !== container);
    this._renderCards();
    this._showToast(`${card.name} opened! 🌱`);
    this._refreshHUD();
  }

  _resolveEventCard(card, container) {
    const effect = card.effect;
    if (!effect) return;

    if (effect.type === 'cash') {
      const amount = effect.minAmount + Math.floor(Math.random() * (effect.maxAmount - effect.minAmount));
      const cx = BOARD.left() + LEFT_W + 160, cy = BOARD.top() + 80;
      for (let i = 0; i < Math.floor(amount / COIN_VALUE); i++) {
        const coin = new CoinSprite(this, cx + (Math.random() - 0.5) * 100, cy + (Math.random() - 0.5) * 30, 'incoming');
        coin.container.setDepth(20);
        this.coins.push({ coin, accountType: 'incoming', amount: COIN_VALUE });
        this._attachCoinEvents(coin);
      }
      this._showToast(`${card.name}: +$${amount.toLocaleString()}! 🌼`);
    } else if (effect.type === 'expense') {
      const amount = effect.minAmount + Math.floor(Math.random() * (effect.maxAmount - effect.minAmount));
      this.state.accounts.checking = {
        ...this.state.accounts.checking,
        balance: Math.max(0, (this.state.accounts.checking?.balance ?? 0) - amount),
      };
      this._syncAccountBalance('checking');
      this._showToast(`${card.name}: -$${amount.toLocaleString()} 🍂`, true);
    } else if (effect.type === 'income_increase') {
      const amount = effect.minAmount + Math.floor(Math.random() * (effect.maxAmount - effect.minAmount));
      this.state.income += amount;
      this._showToast(`Income +$${amount.toLocaleString()}/year! 🌟`);
    } else if (effect.type === 'credit_score') {
      this.state.creditScore = Math.min(850, Math.max(300, this.state.creditScore + effect.delta));
      this._showToast(`Credit score ${effect.delta > 0 ? '+' : ''}${effect.delta}! ⭐`);
    }

    card._resolved = true;
    this.deck.playCard(card.id);
    container.destroy();
    this.cardObjects = this.cardObjects.filter(c => c !== container);
    this._renderCards();
    this._refreshHUD();
  }

  // ─── END TURN ──────────────────────────────────────────────────────────────

  _onEndTurn() {
    const unresolved = this.deck.hand.filter(c => c.type === 'event' && !c._resolved);
    if (unresolved.length > 0) {
      this._showToast(`Resolve all event cards first! (${unresolved.length} left)`, true);
      return;
    }

    this.state = processEndOfTurn(this.state);

    if (this.state.phase === 'end') { this._showEndGame(); return; }

    // ── Coins STAY on the board as visual reminders ──
    // Update balance labels from state (interest/expenses already applied)
    Object.keys(this.accountSlots).forEach(type => {
      const bal  = this.state.accounts[type]?.balance ?? 0;
      const slot = this.accountSlots[type];
      if (slot?.balText) slot.balText.setText(`$${bal.toLocaleString()}`);
    });

    this._showTaxReport();
    this.time.delayedCall(2800, () => this._beginTurn());
  }

  _showTaxReport() {
    const report = this.state.lastTaxReport;
    if (!report) return;
    const w = W(), h = H();
    const pw = 360, ph = 300, px = w / 2 - pw / 2, py = h / 2 - ph / 2;

    const panel   = this.add.container(0, 0).setDepth(400);
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.5);
    overlay.fillRect(0, 0, w, h);

    const card = this.add.graphics();
    card.fillStyle(0xfaf6ef, 1);
    card.fillRoundedRect(px, py, pw, ph, 16);
    card.lineStyle(3, COLORS.ink, 1);
    card.strokeRoundedRect(px, py, pw, ph, 16);

    const lines = [
      `📋  Year ${this.state.turn} — Tax Summary`,
      ``,
      `Gross Income:          $${report.grossIncome.toLocaleString()}`,
      `Trad IRA Deduction:  − $${report.tradIraDeduction.toLocaleString()}`,
      `Standard Deduction:  − $14,600`,
      `Taxable Income:        $${report.taxableIncome.toLocaleString()}`,
      ``,
      ...report.breakdown.map(b => `  ${(b.rate * 100).toFixed(0)}% bracket:   $${Math.round(b.amount).toLocaleString()}`),
      ``,
      `Total Tax Owed:        $${report.total.toLocaleString()}`,
      `Effective Rate:         ${report.effectiveRate}%`,
    ];
    lines.forEach((line, i) => {
      this.add.text(px + 22, py + 16 + i * 18, line, {
        fontSize: i === 0 ? '14px' : '12px', fontFamily: 'Nunito',
        fontStyle: i === 0 ? 'bold' : 'normal', color: '#4a3f35',
      });
    });

    const close = this.add.text(px + pw - 14, py + 12, '✕', {
      fontSize: '17px', fontFamily: 'Nunito', fontStyle: 'bold', color: '#c45050',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => panel.destroy());
    panel.add([overlay, card, close]);
  }

  _showEndGame() {
    const score = scoreGame(this.state);
    this.registry.get('setGameState')?.({ ...this.state, finalScore: score });
    this.registry.get('setPhase')?.('end');
  }

  restartGame() {
    // On restart, destroy coins
    this.coins.forEach(({ coin }) => coin.destroy());
    this.coins = [];
    this.cardObjects.forEach(o => o.destroy?.());
    this.cardObjects = [];
    this.scene.restart();
  }

  // ─── ICON BUTTON ACTIONS ───────────────────────────────────────────────────

  _openMarketPanel() { this._showToast('Stock Market — coming soon! 📈'); }
  _openGlossary()    { this._showToast('Financial Dictionary — coming soon! 📖'); }

  _openAssetsList() {
    const net   = calcNetWorth(this.state);
    const lines = Object.entries(this.state.accounts)
      .filter(([, a]) => a.balance > 0)
      .map(([k, a]) => `${ACCOUNT_CONFIG[k]?.label ?? k}: $${a.balance.toLocaleString()}`);
    lines.push(`Total Net Worth: $${net.toLocaleString()}`);
    this._showToast(lines.join('\n'));
  }

  // ─── UI REFRESH ────────────────────────────────────────────────────────────

  _refreshHUD() {
    const net  = calcNetWorth(this.state);
    const { creditScore, turn, age } = this.state;
    const tier = creditTier(creditScore);

    this.hudAge?.setText(`AGE ${age}  /  YEAR ${turn + 1}`);
    this.hudNetWorth?.setText(`NET WORTH:  $${net.toLocaleString()}`);
    this.hudCredit?.setText(`CREDIT SCORE: ${creditScore}  (${tier.label})`);

    this.registry.get('setGameState')?.({ ...this.state, netWorth: net });
  }

  _refreshUI() {
    this._refreshHUD();
    this.expText?.setText(`DUE: $${totalExpenses(this.state.expenses).toLocaleString()}`);
  }

  _showToast(msg, isNeg = false) {
    const t = this.add.text(W() / 2, H() / 2 - 80, msg, {
      fontSize: '15px', fontFamily: 'Nunito', fontStyle: 'bold',
      color: isNeg ? '#c45050' : '#3a7040',
      backgroundColor: '#faf6ef',
      padding: { x: 18, y: 10 }, align: 'center',
    }).setOrigin(0.5).setDepth(600);

    this.tweens.add({
      targets: t, y: H() / 2 - 130, alpha: 0,
      duration: 2000, ease: 'Power2',
      onComplete: () => t.destroy(),
    });
  }

  // ─── DASHED RECT HELPER ────────────────────────────────────────────────────

  _dashedRect(g, x, y, w, h, color, dashLen = 8, gapLen = 5) {
    g.lineStyle(2, color, 1);
    this._dashLine(g, x,     y,     x + w, y    , dashLen, gapLen);
    this._dashLine(g, x + w, y,     x + w, y + h, dashLen, gapLen);
    this._dashLine(g, x + w, y + h, x,     y + h, dashLen, gapLen);
    this._dashLine(g, x,     y + h, x,     y    , dashLen, gapLen);
  }

  _dashLine(g, x1, y1, x2, y2, dashLen, gapLen) {
    const dx  = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return;
    const ux  = dx / len, uy = dy / len;
    let pos = 0, drawing = true;
    while (pos < len) {
      const next = Math.min(pos + (drawing ? dashLen : gapLen), len);
      if (drawing) {
        g.beginPath();
        g.moveTo(x1 + ux * pos,  y1 + uy * pos);
        g.lineTo(x1 + ux * next, y1 + uy * next);
        g.strokePath();
      }
      pos = next;
      drawing = !drawing;
    }
  }
}
