/* eslint-disable import/no-unresolved */

import Phaser from 'phaser';
import sceneEvents from '../events/events';

export default class MessageScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Message',
    });
  }

  init(opts) {
    if (!opts) opts = {};
    if (opts.messageData) {
      this.messageData = opts.messageData;
      this.dataPassed = true;
      this.timer = opts.messageData.timer;
    }
  }

  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) this.hideEvent.remove(false);
    this.hideEvent = this.time.addEvent(
      { delay: 50, callback: this.hideMessage, callbackScope: this },
    );
  }

  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
    this.time.addEvent({
      delay: this.timer ? this.timer : 2000,
      callback: () => {
        this.scene.stop(this);
      },
      loop: false,
    });
  }

  create() {
    if (this.dataPassed) {
      this.messageText = this.messageData.messageText;
    }
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.strokeRect(80, 25, 220, 40);
    graphics.fillRect(80, 25, 220, 40);
    this.text = this.add.text(190, 45, '', {
      color: '#ffffff', align: 'center', fontSize: 13, wordWrap: { width: 200, useAdvancedWrap: true },
    });
    this.text.setOrigin(0.5);
    sceneEvents.on('Message', this.showMessage, this);
    this.showMessage(this.messageText);
    this.visible = false;
  }
}