import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.gameOver,
    });
  }

  init(data) {
    if (data.dataToPass !== undefined) {
      this.dataProvided = true;
      this.initScore = data.dataToPass.score;
      this.initCoins = data.dataToPass.coins;
      this.initHealth = data.dataToPass.health;
      this.initPosition = data.dataToPass.position;
      this.initLooking = data.dataToPass.looking;
      this.chestLog = data.dataToPass.chestLog;
      this.gameLog = data.dataToPass.gameLog;
    } else {
      this.dataProvided = false;
    }
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 4, 'gameOverImage')
      .setScale(0.2);
  }
}