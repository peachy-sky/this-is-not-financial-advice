import Phaser from 'phaser';

// Lightweight overlay scene for persistent UI elements not managed by React.
export default class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene', active: true }); }
  create() {}
  update() {}
}
