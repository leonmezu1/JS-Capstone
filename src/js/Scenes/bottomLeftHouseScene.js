import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class bottomRightLeftScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.bottomLeftHouse,
    });
  }
}