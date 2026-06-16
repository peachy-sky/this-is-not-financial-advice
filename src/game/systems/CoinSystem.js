import { COIN_VALUE, COLORS } from '../constants.js';

export const COIN_RADIUS = 22;
export const COIN_COLORS = {
  incoming:     0xd4a843,
  checking:     0xf5f0e8,
  savings:      0xa8d4a8,
  hysa:         0x7ab87a,
  cd:           0xc4714a,
  credit_card:  0xf0d4d0,
  roth_ira:     0xe8e070,
  trad_ira:     0xd0c870,
  brokerage:    0xb8d4b8,
  default:      0xd4c0a8,
};

export class CoinSprite {
  constructor(scene, x, y, accountType = 'incoming', amount = COIN_VALUE) {
    this.scene = scene;
    this.accountType = accountType;
    this.amount = amount;
    this.selected = false;

    this.container = scene.add.container(x, y);
    this._buildGraphics();
    this._enableDrag();
  }

  _buildGraphics() {
    const g = this.scene.add.graphics();
    const color = COIN_COLORS[this.accountType] ?? COIN_COLORS.default;
    g.lineStyle(2, 0x8a7060, 1);
    g.fillStyle(color, 1);
    g.fillCircle(0, 0, COIN_RADIUS);
    g.strokeCircle(0, 0, COIN_RADIUS);
    this.gfx = g;

    const label = this.amount < COIN_VALUE
      ? `$${(this.amount / 1000).toFixed(1)}k`
      : '$1k';
    this.label = this.scene.add.text(0, 0, label, {
      fontSize: '9px',
      color: '#4a3f35',
      fontFamily: 'Nunito',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.container.add([this.gfx, this.label]);
    this.container.setSize(COIN_RADIUS * 2, COIN_RADIUS * 2);
    this.container.setInteractive();
  }

  _enableDrag() {
    this.scene.input.setDraggable(this.container);
  }

  setSelected(val) {
    this.selected = val;
    this.gfx.clear();
    const color = COIN_COLORS[this.accountType] ?? COIN_COLORS.default;
    this.gfx.lineStyle(val ? 3 : 2, val ? 0xc4714a : 0x8a7060, 1);
    this.gfx.fillStyle(color, 1);
    this.gfx.fillCircle(0, 0, COIN_RADIUS);
    this.gfx.strokeCircle(0, 0, COIN_RADIUS);
  }

  moveTo(x, y, animate = true) {
    if (animate) {
      this.scene.tweens.add({
        targets: this.container,
        x, y,
        duration: 250,
        ease: 'Back.easeOut',
      });
    } else {
      this.container.setPosition(x, y);
    }
  }

  destroy() {
    this.container.destroy();
  }

  get x() { return this.container.x; }
  get y() { return this.container.y; }
}

export function arrangeCoinStack(coins, cx, cy, maxPerRow = 5) {
  const spacing = COIN_RADIUS * 2 + 4;
  coins.forEach((coin, i) => {
    const col = i % maxPerRow;
    const row = Math.floor(i / maxPerRow);
    coin.moveTo(cx + (col - (maxPerRow - 1) / 2) * spacing, cy + row * spacing);
  });
}
