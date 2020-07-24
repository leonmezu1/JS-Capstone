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
    this.text.setText(`Score: ${scoreInput}`);
  }

  handlePlayerHealth(health) {
    const children = this.hearts.getChildren();
    switch (health) {
      case 500:
        children[2].setTexture('half_heart');
        break;
      case 400:
        children[2].setTexture('empty_heart');
        break;
      case 300:
        children[1].setTexture('half_heart');
        break;
      case 200:
        children[1].setTexture('empty_heart');
        break;
      case 100:
        children[0].setTexture('half_heart');
        break;
      case 0:
        children[0].setTexture('empty_heart');
        break;
      default:
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

    this.text = this.add.text(this.game.renderer.width - 70, 2, 'Score: ', {
      font: '12px Arial',
      fill: '#fff',
      align: 'center',
    });

    sceneEvents.on('player-damaged', this.handlePlayerHealth, this);
    sceneEvents.on('player-score-changed', this.handlePlayerScore, this);
  }
}