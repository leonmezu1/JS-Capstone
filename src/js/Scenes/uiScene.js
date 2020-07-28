import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import sceneEvents from '../events/events';

export default class UiScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.ui,
    });
  }

  handlePlayerScore(scoreInput) {
    this.scoreText.setText(`Score: ${scoreInput}`);
  }

  handlePlayerCoins(coinsInput) {
    setTimeout(() => {
      this.coinsText.setText(`Coins: ${coinsInput}`);
    }, 200);
  }

  handlePlayerHealth(health) {
    const children = this.hearts.getChildren();
    switch (health) {
      case 500:
        children.slice(0, 1).every(heart => heart.setTexture('full_heart'));
        children[2].setTexture('half_heart');
        break;
      case 400:
        children.slice(0, 1).every(heart => heart.setTexture('full_heart'));
        children[2].setTexture('empty_heart');
        break;
      case 300:
        children[0].setTexture('full_heart');
        children[1].setTexture('half_heart');
        children[2].setTexture('empty_heart');
        break;
      case 200:
        children[0].setTexture('full_heart');
        children[1].setTexture('empty_heart');
        children[2].setTexture('empty_heart');
        break;
      case 100:
        children[0].setTexture('half_heart');
        children[1].setTexture('empty_heart');
        children[2].setTexture('empty_heart');
        break;
      case 0:
        children.every(heart => heart.setTexture('empty_heart'));
        break;
      default:
        children.every(heart => heart.setTexture('full_heart'));
        break;
    }
  }

  create() {
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });
    this.hearts.createMultiple({
      key: 'full_heart',
      setXY: {
        x: 10, y: 10, stepX: 16,
      },
      quantity: 3,
    });

    this.scoreText = this.add.text(this.game.renderer.width - 70, 2, 'Score: ', {
      font: '12px Arial',
    });

    this.add.image(6, 26, 'treasure', 'coin_anim_f0.png').setScale(1.1);

    this.coinsText = this.add.text(16, 20, 'Coins: ', {
      fontSize: '14',
    });

    sceneEvents.on('player-damaged', this.handlePlayerHealth, this);
    sceneEvents.on('player-health-event', this.handlePlayerHealth, this);
    sceneEvents.on('player-score-changed', this.handlePlayerScore, this);
    sceneEvents.on('player-coins-changed', this.handlePlayerCoins, this);
  }
}