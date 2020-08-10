import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.menu,
    });
  }
}