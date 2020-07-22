import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class UiScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.ui,
    });
  }

  create() {
    const hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    hearts.createMultiple({
      key: 'full_heart',
      setXY: {
        x: 10, y: 10, stepX: 16,
      },
      quantity: 3,
    });
  }
}