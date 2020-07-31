/* eslint-disable no-unused-expressions */
import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import sceneEvents from '../events/events';

export default class DialogueScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.dialogue,
    });
  }

  init(opts) {
    if (!opts) opts = {};
    if (opts.dialogData) {
      this.dialogData = opts.dialogData;
      this.dataPassed = true;
    }
    this.borderThickness = opts.borderThickness || 3;
    this.borderColor = opts.borderColor || 0x907748;
    this.borderAlpha = opts.borderAlpha || 1;
    this.windowAlpha = opts.windowAlpha || 0.8;
    this.windowColor = opts.windowColor || 0x303030;
    this.windowHeight = opts.windowHeight || 150;
    this.padding = opts.padding || 32;
    this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
    this.dialogSpeed = opts.dialogSpeed || 3;

    this.eventCounter = 0;
    this.visible = true;
    this.dialogText = '';
    this.dialog;
    this.graphics;
    this.closeBtn;

    this.createWindow();
  }

  shutdown() {
    this.scene.stop(this);
  }

  destroy() {
    this.shutdown();
  }

  temporizedDestroy() {
    this.time.addEvent({
      delay: 1500,
      callback: () => {
        this.shutdown();
      },
      loop: false,
    });
  }

  createWindow() {
    const gameHeight = this.getGameHeight();
    const gameWidth = this.getGameWidth();
    const dimensions = this.calculateWindowDimensions(gameWidth, gameHeight);
    this.graphics = this.add.graphics();

    this.createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
    this.createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
    this.createCloseModalButton();
    this.createCloseModalButtonBorder();
  }

  getGameWidth() {
    return this.game.renderer.width;
  }

  getGameHeight() {
    return this.game.renderer.height + 80;
  }

  calculateWindowDimensions(width, height) {
    const x = this.padding;
    const y = height - this.windowHeight - this.padding;
    const rectWidth = width - (this.padding * 2);
    const rectHeight = this.windowHeight / 2;
    return {
      x,
      y,
      rectWidth,
      rectHeight,
    };
  }

  createInnerWindow(x, y, rectWidth, rectHeight) {
    this.graphics.fillStyle(this.windowColor, this.windowAlpha);
    this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
  }

  createOuterWindow(x, y, rectWidth, rectHeight) {
    this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
    this.graphics.strokeRect(x, y, rectWidth, rectHeight);
  }

  createCloseModalButtonBorder() {
    const x = this.getGameWidth() - this.padding - 20;
    const y = this.getGameHeight() - this.windowHeight - this.padding;
    this.graphics.strokeRect(x, y, 20, 20);
  }

  toggleWindow() {
    this.visible = !this.visible;
    if (this.diagText) this.diagText.visible = this.visible;
    if (this.graphics) this.graphics.visible = this.visible;
    if (this.closeBtn) this.closeBtn.visible = this.visible;
  }

  createCloseModalButton() {
    this.closeBtn = this.make.text({
      x: this.getGameWidth() - this.padding - 14,
      y: this.getGameHeight() - this.windowHeight - this.padding + 3,
      text: 'X',
      style: {
        font: 'bold 12px Arial',
        fill: this.closeBtnColor,
      },
    });
    this.closeBtn.setInteractive();

    this.closeBtn.on('pointerover', () => {
      this.closeBtn.setTint(0xff0000);
    });
    this.closeBtn.on('pointerout', () => {
      this.closeBtn.clearTint();
    });
    this.closeBtn.on('pointerdown', () => {
      this.toggleWindow();
    });
  }

  drawDialogue(text) {
    let i = 0;
    this.timedEvent = this.time.addEvent({
      delay: 150 - (this.dialogSpeed * 40),
      callback: () => {
        if (i <= text.length) {
          this.diagText.setText(text.slice(0, i));
          i += 1;
        } else {
          this.timedEvent.destroy();
        }
      },
      loop: true,
    });
  }

  clearText() {
    this.diagText.setText('');
  }

  create() {
    if (this.dataPassed) {
      this.dialogText = this.dialogData.diagText;
    }

    this.diagText = this.add.text(
      this.padding + 10,
      this.getGameHeight() - this.windowHeight - this.padding + 10,
      this.dialogText,
      {
        wordWrap: { width: this.getGameWidth() - (this.padding * 2) - 25 },
      },
    );

    if (this.dataPassed && this.dialogData.diagMode === 'temporized') this.temporizedDestroy();

    sceneEvents.on('shutdown', this.shutdown, this);
    sceneEvents.on('destroy', this.destroy, this);
    sceneEvents.on('drawDiag', this.drawDialogue, this);
    sceneEvents.on('clearText', this.clearText, this);
    sceneEvents.on('temporized-diag-box', this.temporizedDestroy, this);
    sceneEvents.on('toggle-dialog', this.toggleWindow, this);
  }
}
