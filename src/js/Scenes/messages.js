import Phaser from 'phaser';
import sceneEvents from '../events/events';

export default class Message extends Phaser.Scene {
  constructor() {
    super({
      key: 'Message',
    });
  }

  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent(
      { delay: 2000, callback: this.hideMessage, callbackScope: this },
    );
  }

  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  }

  create() {
    const graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.strokeRect(-60, -18, 220, 40);
    graphics.fillRect(-60, -18, 220, 40);
    this.text = this.add.text(50, 0, 'text', {
      color: '#ffffff', align: 'center', fontSize: 13, wordWrap: { width: 200, useAdvancedWrap: true },
    });
    this.text.setOrigin(0.5);
    sceneEvents.on('Message', this.showMessage, this);
    this.visible = false;
  }
}