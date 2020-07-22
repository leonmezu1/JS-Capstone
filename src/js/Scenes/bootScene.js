import { Scene } from 'phaser';
import { Handler } from './scenesHandler';

export default class BootScene extends Scene {
  constructor() {
    super({
      key: Handler.scenes.boot,
    });
  }

  preload() {}
}
