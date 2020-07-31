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

  boot() {
    sceneEvents.on('shutdown', this.shutdown, this);
    sceneEvents.on('destroy', this.destroy, this);
  }

  shutdown() {
    this.remove(this);
  }

  destroy() {
    this.shutdown();
  }

  init(opts) {
    if (!opts) opts = {};
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
    this.text;
    this.dialog;
    this.graphics;
    this.closeBtn;

    this.createWindow();
  }

  createWindow() {
    const gameHeight = this.getGameHeight();
    const gameWidth = this.getGameWidth();
    const dimensions = this.calculateWindowDimensions(gameWidth, gameHeight);
    this.graphics = this.add.graphics();

    this.createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
    this.createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
  }

  getGameWidth() {
    return this.game.renderer.width;
  }

  getGameHeight() {
    return this.game.renderer.height;
  }

  calculateWindowDimensions(width, height) {
    const x = this.padding;
    const y = height - this.windowHeight - this.padding;
    const rectWidth = width - (this.padding * 2);
    const rectHeight = this.windowHeight;
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
}
