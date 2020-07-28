import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class topRightHouseScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.topRightHouse,
    });
  }
}