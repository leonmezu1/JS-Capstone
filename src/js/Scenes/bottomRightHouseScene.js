import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class bottomRightHouseScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.bottomRightHouse,
    });
  }
}
